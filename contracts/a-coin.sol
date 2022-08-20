//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";
import "./c-coin.sol";

contract ACoin is ERC721URIStorage, Ownable {
    address private contractOwner;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Maaping from tokenURI to tokenId
    mapping(string => uint256) private _URI2TokenId;

    // Mapping from token ID to sale status
    mapping(uint256 => bool) private _forSale;

    // Mapping from token ID to prices
    mapping(uint256 => uint256) private _prices;

    mapping(address => uint256[]) private _NFTs;

    // tokenID to hash of the article
    mapping(uint256 => string) private _tokenMD5s;

    // The max uint256 value of solidity
    uint256 private constant MAX_INT = 2**256 - 1;
    uint256 private constant NUM_CCOIN_TO_WAIVE_COMMISSION = 100;
    uint256 private constant COMMISSION_PERCENTAGE = 1000;

    // Constant values for bonus
    uint256 private constant BONUS_LIMIT = 3;
    uint256 private constant BONUS_GAP = 3 seconds;

    uint256 lastBonusTime;
    address[BONUS_LIMIT] addressToBeGivenBonus;
    mapping(address => uint256) _numSales;

    // CCoin instance to access the CCoin contract
    CCoin private cCoin;

    constructor() ERC721("ACoinNFT", "ACoin") {
        contractOwner = msg.sender;
        cCoin = new CCoin(address(this));
    }

    // Only owner can mint a new token.
    function mintNFT(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _URI2TokenId[tokenURI] = newItemId;

        _NFTs[recipient].push(newItemId);
        _forSale[newItemId] = false;
        _prices[newItemId] = MAX_INT;

        return newItemId;
    }

    function mintNFTWithMD5(string memory tokenURI, string memory MD5)
        public
        returns (uint256)
    {
        uint256 newItemId = mintNFTAnyone(tokenURI);
        _tokenMD5s[newItemId] = MD5;
        return newItemId;
    }

    // Anyone can mint an NFT. Consider which one to use.
    function mintNFTAnyone(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _URI2TokenId[tokenURI] = newItemId;

        _NFTs[msg.sender].push(newItemId);
        _forSale[newItemId] = false;
        _prices[newItemId] = MAX_INT;

        return newItemId;
    }

    function _addToNFTs(address recipient, uint256 tokenId) private {
        _requireMinted(tokenId);
        _NFTs[recipient].push(tokenId);
    }

    function _removeFromNFTs(address sender, uint256 tokenId) private {
        _requireMinted(tokenId);
        if (_NFTs[sender].length <= 1) {
            delete _NFTs[sender][0];
            _NFTs[sender].pop();
        } else {
            for (uint i = 0; i < _NFTs[sender].length; i++) {
                if (_NFTs[sender][i] == tokenId) {
                    _NFTs[sender][i] = _NFTs[sender][_NFTs[sender].length - 1];
                    _NFTs[sender].pop();
                }
            }
        }
    }

    function _transferNFT(
        address sender,
        address recipient,
        uint256 tokenId
    ) private returns (bool) {
        _forSale[tokenId] = false;
        _transfer(sender, recipient, tokenId);
        _addToNFTs(recipient, tokenId);
        _removeFromNFTs(sender, tokenId);
        return true;
    }

    // Refund the extra ETH to the buyer
    function _refund(
        address recipient,
        uint256 price,
        uint256 commission,
        uint256 paid
    ) private returns (bool) {
        uint extraFund = paid - price;
        bool waiveCommission = cCoin.totalBalance(recipient) >=
            NUM_CCOIN_TO_WAIVE_COMMISSION;
        if (waiveCommission) {
            cCoin.reduceBalance(recipient, NUM_CCOIN_TO_WAIVE_COMMISSION);
        } else {
            extraFund -= commission;
        }
        if (extraFund > 0) {
            payable(recipient).transfer(extraFund);
        }
        return waiveCommission;
    }

    // To transfer the token ownership to another address, the owner need to pay for the commission.
    function transfer(address recipient, uint256 tokenId)
        public
        payable
        returns (bool)
    {
        _requireMinted(tokenId);
        require(
            _msgSender() == ownerOf(tokenId),
            "It is not your token, so you cannot transfer it."
        );

        require(
            recipient != ownerOf(tokenId),
            "You cannot transfer to yourself."
        );

        uint commission = getCommission(_prices[tokenId]);
        require(
            msg.value >= _prices[tokenId] + commission,
            "You do not have enough ether to pay"
        );

        _transferNFT(_msgSender(), recipient, tokenId);
        return _refund(recipient, _prices[tokenId], commission, msg.value);
    }

    function getCommission(uint256 price) public pure returns (uint256) {
        return price / COMMISSION_PERCENTAGE;
    }

    function purchase(uint256 tokenId) public payable returns (bool) {
        _requireMinted(tokenId);
        require(_forSale[tokenId], "This token is not for sale");
        address buyer = _msgSender();
        require(buyer != ownerOf(tokenId), "You can't purchase your own token");

        uint commission = getCommission(_prices[tokenId]);
        require(
            msg.value >= _prices[tokenId] + commission,
            "You do not have enough ether to pay"
        );
        address saler = ownerOf(tokenId);

        // Transfer the ETH to the original NFT owner
        payable(saler).transfer(_prices[tokenId]);
        // Transfer the NFT ownership to the buyer
        _transferNFT(saler, buyer, tokenId);
        // The buyer will get a CCoin as bonus
        cCoin.mintFT(buyer);
        _giveBonus(saler);

        return _refund(buyer, _prices[tokenId], commission, msg.value);
    }

    function _giveBonus(address user) private {
        _numSales[user]++;
        uint256 contractBalance = address(this).balance;
        if (
            block.timestamp >= lastBonusTime + BONUS_GAP && contractBalance > 0
        ) {
            lastBonusTime = block.timestamp;
            // Give bonus
            uint bonus = contractBalance / BONUS_LIMIT;
            require(
                bonus * BONUS_LIMIT <= address(this).balance,
                "Bonus is not correct"
            );
            for (uint i = 0; i < addressToBeGivenBonus.length; i++) {
                payable(addressToBeGivenBonus[i]).transfer(bonus);
                _numSales[addressToBeGivenBonus[i]] = 0;
            }
            delete addressToBeGivenBonus;
        }
        // Try to update toBeGivenBonus
        for (uint i = 0; i < addressToBeGivenBonus.length; i++) {
            if (_numSales[user] > _numSales[addressToBeGivenBonus[i]]) {
                addressToBeGivenBonus[i] = user;
                break;
            }
        }
    }

    function getNumSales(address user) public view returns (uint) {
        return _numSales[user];
    }

    function getAddressToBeGivenBonus()
        public
        view
        returns (address[BONUS_LIMIT] memory)
    {
        return addressToBeGivenBonus;
    }

    function getBalanceOfContract() public view returns (uint256) {
        return address(this).balance;
    }

    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    function getTokenIdByURI(string memory tokenURI)
        public
        view
        returns (uint256)
    {
        return _URI2TokenId[tokenURI];
    }

    function getOwnerByURI(string memory tokenURI)
        public
        view
        returns (address)
    {
        return ownerOf(_URI2TokenId[tokenURI]);
    }

    // Check if the NFT is for sale
    function isForSale(uint256 tokenId) public view returns (bool) {
        return _forSale[tokenId];
    }

    // Set is for sale to true or false
    function setForSale(uint256 tokenId, bool forSale) public {
        _requireMinted(tokenId);
        require(
            _msgSender() == ownerOf(tokenId),
            "Only the owner can set a token for sale"
        );
        _forSale[tokenId] = forSale;
    }

    // Get the price of the NFT
    function priceOf(uint256 tokenId) public view returns (uint256) {
        return _prices[tokenId];
    }

    // Set the price of the NFT in ETH
    function setPrice(uint256 tokenId, uint256 price) public {
        _requireMinted(tokenId);
        require(
            _msgSender() == ownerOf(tokenId),
            "Only the owner can set a token price"
        );
        // The currency is in ether (rather than wei)
        _prices[tokenId] = price * 1e18;
    }

    function getNFTs() public view returns (uint256[] memory) {
        return _NFTs[msg.sender];
    }

    function getAllTokenIdsOf(address user)
        public
        view
        returns (uint256[] memory)
    {
        return _NFTs[user];
    }

    function getMD5Of(uint256 tokenId) public view returns (string memory) {
        return _tokenMD5s[tokenId];
    }

    // Interfaces for the CCoin Contract

    // Get the CCoin Contract Address
    function getCCoinContractAddress() public view returns (address) {
        return address(cCoin);
    }

    function cCoinBalanceOf() public view returns (uint256) {
        return cCoin.balanceOf(_msgSender());
    }

    function cCoinTotalBlanceOf() public view returns (uint256) {
        return cCoin.totalBalance(_msgSender());
    }

    function cCoinAmountOf() public view returns (uint256) {
        return cCoin.amountOf(_msgSender());
    }

    function getCCoin() public view returns (CCoin) {
        return cCoin;
    }

    event Received(address, uint);

    receive() external payable {
        console.log("Received");
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
}
