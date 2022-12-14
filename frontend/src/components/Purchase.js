import React from "react";
import { Toast, Button } from "@douyinfe/semi-ui";

export class Purchase extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {

        const successToast = {
            content: 'purchase Successfully',
            duration: 3,
        }

        return (
            <div>

                <Button
                    onClick={() => {
                        // const formData = new FormData(event.target);
                        // const tokenID = formData.get("tokenID");
                        console.log("this.props.NFTID",this.props.NFTID)

                        if (this.props.NFTID) {
                            this.props.purchaseNFT(this.props.NFTID).then(
                                res => {
                                    console.log("purchase successful");
                                    Toast.success(successToast);
                                }
                            ).catch(err => {
                                console.log(err);
                                Toast.error({
                                    content: "Purchase Failed" + err,

                                    duration: 0,
                                });
                            })
                        }
                    }}>
                    BUY</Button>

            </div>
        );
    }
}