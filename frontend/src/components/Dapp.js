import React from "react";

// import { uploadCopyrit } from "../Interact_logic_with_contract/contract_api";

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
        // const tid = uploadCopyrit(recipient, tokenURI);
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
}