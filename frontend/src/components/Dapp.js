import React from "react";

import { ethers } from "ethers";

import TokenArtifact from "../contract_address/ACoin.json";
import contractAddress from "../contract_address/contract_address.json";

import { Mint } from "./Mint";

export class Dapp extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = {
            tokenURI: undefined,
            recipient: undefined,
            tokenId: undefined,
        }
        this.state = this.initialState;

    }
    render() {
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

                        {/*
              This component displays a form that the user can use to send a 
              transaction and transfer some tokens.
              The component doesn't have logic, it just calls the transferTokens
              callback.
            */}
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
}