import React from "react";
import { ethers } from "ethers";

import TokenArtifact from "../api/contract_address/ACoin.json";
import contractAddress from "../api/contract_address/contract_address.json";

// import { uploadCopyrit } from "../api/contract_api";

import { Mint } from "./Mint";
import { ConnectWallet } from "./ConnectWallet";
import { NoWalletDetected } from "./NoWalletDetected";

const HARDHAT_NETWORK_ID = '1337';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;


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

                    </div>
                </div>

                <hr />

                <div className="row">
                    <div className="col-12">
                        {
                            <Mint
                                mintNFT={(recipient, tokenURI) =>
                                     this._mintNFT(recipient, tokenURI)
                                }
                            />
                        }
                    </div>
                </div>
            </div>
        )

    }

    // async _mintNFT(recipient, tokenURI) {
    //     const tid = await this._token.mintNFT(recipient, tokenURI);
    //     // this.setState({ tokenId: tid });
    //     // const receipt = await tid.wait();

    //     // if (receipt.status === 0) {
    //     //     // We can't know the exact error that made the transaction fail when it
    //     //     // was mined, so we throw this generic one.
    //     //     throw new Error("Transaction failed");
    //     // }
    //     console.log("recipient", recipient);
    //     console.log("tokenURI", tokenURI);
    // }

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
    async _mintNFT(authorAd, copyrightURL) {

        const copyrightID = await this._token.mintNFT(authorAd, copyrightURL);
        // return copyrightID;
        return copyrightID;
    }

    async _verify(authorAd, copyright){

    }

    async _searchAuthorsCopyright(authorAd){

        let arr = new Array( 1 ).fill( 0 ).map( _ => new Array( 3 ) );

        return arr;
    }

    async _setCopyrightSaleState(tokenId){
        let sale_state = await _token.isForSale(tokenId);
        if (sale_state == 0){
            await _token.setForSale(tokenId, 1);
        }else{
            await _token.setForSale(tokenId, 0);
        }
        return true;
    }

    async _setCopyrightPrice(tokenId,price){
        await _token.setPrice(tokenId,price);
        return true;
    }

    async _transCoprightToOther(recipientAd, tokenId){
        await _token.transfer(recipientAd, tokenId);
    }



}