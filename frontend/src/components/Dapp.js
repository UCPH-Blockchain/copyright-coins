import React from "react";
import { ethers } from "ethers";

import TokenArtifact from "../api/contract_address/ACoin.json";
import contractAddress from "../api/contract_address/contract_address.json";

// import { uploadCopyrit } from "../api/contract_api";

import { Mint } from "./Mint";
import { ConnectWallet } from "./ConnectWallet";
import { NoWalletDetected } from "./NoWalletDetected";
import { Verify } from "./Verify";
import { PriceSet } from "./PriceSet";
import { Transfer } from "./Transfer";
import { Search } from "./Search";
import { Result } from "./Result";
import { Copyrights } from "./Copyrights";

import crypto from 'crypto-js';

const HARDHAT_NETWORK_ID = '31337';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;
const NUMBER_COIN_TO_WAIVE_COMMISSION = 100;


export class Dapp extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            // The user's address and balance
            selectedAddress: undefined,
            balance: undefined,

            tokenURI: undefined,
            recipient: undefined,
            tokenId: undefined,

            networkError: undefined,
        }
        this.state = this.initialState;

    }
    render() {
        if (window.ethereum === undefined) {
            return <NoWalletDetected />;
        }

        // this._initializeEthers();
        if (!this.state.selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={() => this._connectWallet()}
                    networkError={this.state.networkError}
                    dismiss={() => this._dismissNetworkError()}
                />
            );
        }

        return (
            <div className="container p-4">
                <div className="row">
                    <div className="col-12">
                        <h1>
                            Welcom to article copyright recording and trading system
                        </h1>
                        <p>
                            Your address is {this.state.selectedAddress}
                        </p>

                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-12">
                        {
                            <Mint
                                mintNFT={(tokenURI) =>
                                    this._mintNFT(tokenURI)
                                }
                                publicKey={this.state.selectedAddress}
                            />
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        {
                            <Verify
                                verifyNFT={(recipient, tokenURI) =>
                                    this._verify(recipient, tokenURI)
                                }
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }

    async _connectWallet() {
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (!this._checkNetwork()) {
            return;
        }

        this._initialize(selectedAddress);
    }

    _checkNetwork() {
        console.log(window.ethereum.networkVersion)
        if (window.ethereum.networkVersion === HARDHAT_NETWORK_ID) {
            return true;
        }

        this.setState({
            networkError: 'Please connect Metamask to Localhost:8545'
        });

        return false;
    }

    _initialize(userAddress) {
        this.setState({
            selectedAddress: userAddress,
        });

        this._initializeEthers();
    }

    async _initializeEthers() {

        this._provider = new ethers.providers.Web3Provider(window.ethereum);

        this._token = new ethers.Contract(
            contractAddress.Token,
            TokenArtifact.abi,
            this._provider.getSigner(0)
        );
        console.log("this._token", this._token);
    }
    _dismissNetworkError() {
        this.setState({ networkError: undefined });
    }

    //upload copyright
    //return copyright ID
    async _mintNFT(copyrightURL) {

        const copyrightID = await this._token.mintNFTAnyone(copyrightURL);
        // return copyrightID;
        return copyrightID;
    }


    //upload copyright with content and copyrightURL
    //return copyright ID
    async _mintWithMd5(tokenURI, text) {
        const hashResult = crypto.md5(text);
        const copyrightID = await this._token.mintNFTWithMD5(tokenURI, hashResult);
        return copyrightID;
    }

    //change the state of the copyright 
    //return copyright state after change
    async _setCopyrightSaleState(tokenId) {
        const sale_state = await this._token.isForSale(tokenId);
        if (sale_state == 0) {
            await this._token.setForSale(tokenId, 1);
            return 1;
        } else {
            await this._token.setForSale(tokenId, 0);
            return 0;
        }
    }

    //author set the price of the copyright
    //return action is successful
    async _setCopyrightPrice(tokenId, price) {
        await this._token.setPrice(tokenId, price);
        return true;
    }

    //author transfer his copyright the other people
    //return whether the transfer is successful
    async _transCoprightToOther(recipientAd, tokenId) {
        await this._token.transfer(recipientAd, tokenId);
        return true;
    }

    //verify if the copyright is belong to the author 
    //return the result of verify (1:yes, 0:no)
    async _verify(authorAd, copyrightURL) {
        const copyrightOwner = await this._token.getOwnerByURI(copyrightURL);
        if (authorAd == copyrightOwner) {
            return 1;
        } else {
            return 0;
        }
    }

    //search copyright by the author's public key
    //return array like [[tokenid1, URL1], [tokenid2, URL2]]
    async _searchAuthorsCopyright(authorAd) {
        const copyrightList = new Array;
        const tokenIdAr = await this._token.getAllTokenIdsOf(authorAd);
        for (const i = 0; i < tokenIdAr.length; i++) {
            const tokenId = tokenIdAr[i];
            const tokenURI = await this._token.tokenURI(tokenId);
            const nftAr = [tokenId, tokenURI];
            copyrightList.push(nftAr);
        }
        return copyrightList;
    }

    //buy copyright
    async _buyCopyright(tokenId) {
        await this._token.purchase(tokenId);
        return true;
    }

    //query if refund during this purchase
    //return 1:yes, 0:no
    async _ifRefund() {
        const cCoinBalance = await this._token.cCoinBalanceOf();
        if (cCoinBalance >= NUMBER_COIN_TO_WAIVE_COMMISSION) {
            return 1;
        } else {
            return 0;
        }
    }


}