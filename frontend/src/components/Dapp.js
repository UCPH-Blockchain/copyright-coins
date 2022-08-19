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

        this._initializeEthers();

        return (
            <div className="container p-4">
                <div className="row">
                    <div className="col-12">
                        <h1>
                            Welcom to article copyright recording and trading system
                        </h1>

                        {/* <div>
                            <ConnectWallet
                                connectWallet={() => this._connectWallet()}
                                networkError={this.state.networkError}
                                dismiss={() => this._dismissNetworkError()}
                            />

                        </div> */}

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

    async _mintNFT(recipient, tokenURI) {
        const tid = await this._token.mintNFT(recipient, tokenURI);
        // this.setState({ tokenId: tid });
        // const receipt = await tid.wait();

        // if (receipt.status === 0) {
        //     // We can't know the exact error that made the transaction fail when it
        //     // was mined, so we throw this generic one.
        //     throw new Error("Transaction failed");
        // }
        console.log("recipient", recipient);
        console.log("tokenURI", tokenURI);
    }

    async _connectWallet() {
        const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (!this._checkNetwork()) {
            return;
        }

        this._initialize(selectedAddress);
    }

    _checkNetwork() {
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

        this._aToken = new ethers.Contract(
            contractAddress.Token,
            TokenArtifact.abi,
            this._provider.getSigner(0)
        );
    }
    _dismissNetworkError() {
        this.setState({ networkError: undefined });
    }

}