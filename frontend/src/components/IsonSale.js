import React from "react";
import { Toast, Button } from "@douyinfe/semi-ui";

export class IsonSale extends React.Component {
    constructor(props) {
        super(props);
        this.state = {onSale: false,};
    }
    render() {
        console.log("this.props.NFTID",this.props.NFTID)
        const successToast = {
            content: 'set On Sale State Successfully',
            duration: 3,
        }
        let that = this;
        return (
            <div>
                <Button
                    onClick={() => {
                        console.log("this.props.NFTID",this.props.NFTID)

                        if (this.props.NFTID) {
                            
                            this.props.setOnSaleState(this.props.NFTID).then(
                                res => {
                                    console.log("set On Sale State Successfully");
                                    that.setState({onSale: res});
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
                    }}
                    // theme='solid' type='primary' style={{ marginRight: 8 }}
                    >
                    BUY</Button>
                    {/* type={this.state.onSale?'primary':'tertiary' */}
            </div>
        );
    }
}