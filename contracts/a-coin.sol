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

    // CCoin instance to access the CCoin contract
    CCoin private cCoin;

    constructor() ERC721("ACoinNFT", "ACoin") {
        contractOwner = address(this);
        cCoin = new CCoin(address(this));
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
    // function transfer(address recipient, uint256 tokenId) payable public {
    //     _requireMinted(tokenId);
    //     safeTransferFrom(_msgSender(), recipient, tokenId);
    // }

    // function purchase (uint256 tokenId)
    //     payable
    //     public
    //     returns (bool)
    // {
    //     _requireMinted(tokenId);
    //     require(_forSale[tokenId], "This token is not for sale");
    //     require(_msgSender() != ownerOf(tokenId), "You can't purchase your own token");
    //     _transfer(_msgSender(), ownerOf(tokenId), tokenId);
    //     return true;
    // }

    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    function isForSale(uint256 tokenId) public view returns (bool) {
        return _forSale[tokenId];
    }

    function setForSale(uint256 tokenId, bool forSale) public {
        _requireMinted(tokenId);
        require(
            _msgSender() == ownerOf(tokenId),
            "Only the owner can set a token for sale"
        );
        _forSale[tokenId] = forSale;
    }

    function priceOf(uint256 tokenId) public view returns (uint256) {
        return _prices[tokenId];
    }

    function setPrice(uint256 tokenId, uint256 price) public {
        _requireMinted(tokenId);
        require(
            _msgSender() == ownerOf(tokenId),
            "Only the owner can set a token price"
        );
        _prices[tokenId] = price;
    }

    function getCCoinContractAddress() public view returns (address) {
        return cCoin.address;
    }

    event Received(address, uint);
    receive() external payable {
        msg.data();
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {
        emit Received(msg.sender, msg.value);
    }
}
