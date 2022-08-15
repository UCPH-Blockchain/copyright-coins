//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc20](https://docs.openzeppelin.com/contracts/3.x/erc20)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "hardhat/console.sol";
import "./a-coin.sol";

contract CCoin is ERC20{

    // An address type variable is used to store ethereum accounts.
    address public accountOwner;
    ACoin private aCoin;

    struct minter{
        uint256 amount_per_day;
        uint256 refresh_time;
    }

    // Here we store the number of CCoins each account mint in a day, and then limit it.
    mapping(address => minter) public mintPerDay;

    // set the biggest amount of thr minter mint per day
    uint256 private totalMintPerDay = 1000;

    /**
     * Contract initialization.
     */
    constructor() ERC20("My FT Token", "CCoin") {
        accountOwner = msg.sender;
        aCoin = new ACoin(address(this));
    }

    // mint
    function mintFT(address minterAdd) public {
        
        if (mintPerDay[minterAdd].amount_per_day == 0){
            mintPerDay[minterAdd].refresh_time = block.timestamp;
        } 
        // another 24h, update recording time and amount of mintering per day.
        else if((block.timestamp - mintPerDay[minterAdd].refresh_time) >= 1 days ){
            mintPerDay[minterAdd].refresh_time = block.timestamp;
            mintPerDay[minterAdd].amount_per_day = 0;
        }

        mintPerDay[minterAdd].amount_per_day += 1;

        if (mintPerDay[minterAdd].amount_per_day < totalMintPerDay){
            _mint(minterAdd, 1);
        }
    }

    // get balance of the account
    function TotleBalance(address account) public view returns (uint256){
        uint256 balance = balanceOf(account);
        return balance;
    }

    // get amount of the minter mint per day
    function amountOf(address account) public view returns (uint256){
        return mintPerDay[account].amount_per_day;
    }

    //reward, transfer tocken from msg.sender to address "to"
    function reward(address to, uint256 amount) public {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balanceOf(msg.sender) >= amount, "Not enough tokens");

        // We can print messages and values using console.log, a feature of
        // Hardhat Network:
        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );

        _transfer(msg.sender, to, amount);
    }
 
    // buy copyright using CCoin
    function purchasebyC(uint256 tokenId) public returns (bool) {
        
        address receiptAdd = aCoin.ownerOf(tokenId);
        uint price = aCoin.priceOf(tokenId);

        //transfer CCoin
        _transfer(msg.sender, receiptAdd, price);

        //transfer ACoin
        aCoin.ship(msg.sender, tokenId);

        return true;
    }

    // buy copyright using other Coins(eg.ETH)
    function purchasebyOther(uint256 tokenId) public returns (bool) {

        //transfer ACoin
        aCoin.ship(msg.sender, tokenId);

        return true;
    }



}
    
