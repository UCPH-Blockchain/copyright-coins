//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract ACoin is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from token ID to sale status
    mapping(uint256 => bool) private _forSale;

    // Mapping from token ID to prices
    mapping(uint256 => uint256) private _prices;

    // The max uint256 value of solidity 
    uint256 private constant MAX_INT = 2**256 - 1;

    // Deploy the C-Coin contract first.
    // Then the A-Coin will trust that C-Coin contract unconditionally.
    address private constant cCoinAddress = 0xB88D33486476aC89FBEDB07937FD150aDE2D7c72;

    constructor() ERC721("ACoinNFT", "ACoin") {}

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

    function transfer(address recipient, uint256 tokenId) public {
        _requireMinted(tokenId);
        safeTransferFrom(_msgSender(), recipient, tokenId);
    }

    function ship(address recipient, uint256 tokenId) public {
        _requireMinted(tokenId);
        require(_msgSender() == cCoinAddress, "Only specific C-Coin can ship");
        _forSale[tokenId] = false;
        _transfer(ownerOf(tokenId), recipient, tokenId);
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
}
