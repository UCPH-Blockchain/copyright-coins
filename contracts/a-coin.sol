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

    // Mapping from token ID to sale status
    mapping(uint256 => bool) private _forSale;

    // Mapping from token ID to prices
    mapping(uint256 => uint256) private _prices;

    // The max uint256 value of solidity
    uint256 private constant MAX_INT = 2**256 - 1;
    uint256 private constant NUM_CCOIN_TO_WAIVE_COMMISSION = 100;
    uint256 private constant COMMISSION_PERCENTAGE = 1000;

    // CCoin instance to access the CCoin contract
    CCoin private cCoin;

    constructor() ERC721("ACoinNFT", "ACoin") {
        contractOwner = msg.sender;
        cCoin = new CCoin();
    }

    // Anyone can mint a new token.
    function mintNFT(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _forSale[newItemId] = false;
        _prices[newItemId] = MAX_INT;

        return newItemId;
    }

    // To transfer the token ownership to another address, the owner need to pay for the commission.
    function transfer(address recipient, uint256 tokenId)
        public
        payable
        returns (bool)
    {
        _requireMinted(tokenId);
        require(
            _msgSender() != ownerOf(tokenId),
            "You cannot transfer your token to yourself"
        );

        uint commission = _prices[tokenId] / COMMISSION_PERCENTAGE;

        require(
            msg.value >= _prices[tokenId] + commission,
            "You do not have enough ether to pay"
        );

        _forSale[tokenId] = false;
        safeTransferFrom(_msgSender(), recipient, tokenId);

        // Refund the extra ETH to the buyer
        uint extraFund = msg.value - _prices[tokenId];
        bool waiveCommission = cCoin.totalBalance(_msgSender()) >=
            NUM_CCOIN_TO_WAIVE_COMMISSION;
        if (waiveCommission) {
            cCoin.reduceBalance(_msgSender(), NUM_CCOIN_TO_WAIVE_COMMISSION);
        } else {
            extraFund -= commission;
        }
        if (extraFund > 0) {
            payable(_msgSender()).transfer(extraFund);
        }
        return waiveCommission;
    }

    function purchase(uint256 tokenId) public payable returns (bool) {
        _requireMinted(tokenId);
        require(_forSale[tokenId], "This token is not for sale");
        address buyer = _msgSender();
        require(buyer != ownerOf(tokenId), "You can't purchase your own token");

        uint commission = _prices[tokenId] / COMMISSION_PERCENTAGE;
        require(
            msg.value >= _prices[tokenId] + commission,
            "You do not have enough ether to pay"
        );

        // Get ready to transfer the token
        _forSale[tokenId] = false;

        // Transfer the ETH to the original NFT owner
        payable(ownerOf(tokenId)).transfer(_prices[tokenId]);

        // Transfer the NFT ownership to the buyer
        _transfer(ownerOf(tokenId), _msgSender(), tokenId);
        // The buyer will get a CCoin as bonus
        cCoin.mintFT(buyer);

        // Refund the extra ETH to the buyer
        uint extraFund = msg.value - _prices[tokenId];
        bool waiveCommission = cCoin.totalBalance(buyer) >=
            NUM_CCOIN_TO_WAIVE_COMMISSION;
        if (waiveCommission) {
            cCoin.reduceBalance(buyer, NUM_CCOIN_TO_WAIVE_COMMISSION);
        } else {
            extraFund -= commission;
        }
        if (extraFund > 0) {
            payable(buyer).transfer(extraFund);
        }
        return waiveCommission;
    }

    function getContractOwner() public view returns (address) {
        return contractOwner;
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

    event Received(address, uint);

    receive() external payable {
        console.log("Received");
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
}
