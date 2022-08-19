import React from "react";

// import { uploadCopyrit } from "../Interact_logic_with_contract/contract_api";

import { Mint } from "./Mint";

export class D_app extends React.Component {
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

                        <div style={{ display: "flex" }}>
                            <button
                                style={{ marginLeft: "auto" }}
                            >
                                log in
                            </button>
                        </div>

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

    async _mintNFT(authorAd, copyrightURL) {

        const copyrightID = await _token.mintNFT(authorAd, copyrightURL);
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