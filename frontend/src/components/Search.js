import React from "react";
import { Toast, Card, Typography, Space, Button, Tag, Text } from "@douyinfe/semi-ui";
import { Purchase } from "./Purchase";
// import { Copyrights } from "./Copyrights";

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: "",
            copyrightList: [],
            isAuthor: false,
        };
    }

    render() {
        const { Text } = Typography;
        const styles = {
            inputTitle: {
                padding: "20px",
                fontSize: "20px",
            },
            mainTitle: {
                padding: "20px",
                fontSize: "28px",
                color: "#3b0e7b",
            },
            spaceButton: {
                padding: "10px",
                paddingTop: "20px",
                paddingLeft: "250px"
            },
            okButton: {
                width: 120,
                backgroundColor: "#a3d9f5",
                color: "black",
                marginLeft: "410px",
                marginTop: "30px",
                height: 30,
                fontSize: "18px"
            },
            input1: {
                marginLeft: "225px",
                width: "500px",
                height: "30px",
                fontSize: "20px",
                marginTop: "40px"
            },
        };
        const successToast = {
            content: 'Seach Successfully',
            duration: 3,
        }
        // const onClickSearchBtn = (event) => {
        //     event.preventDefault();
        //     const formData = new FormData(event.target);
        //     const publicKey = formData.get("publicKey");

        //     if (publicKey) {
        //         this.props.searchNFT(publicKey).then(
        //             res => {
        //                 console.log("copyrightList:", res);
        //                 this.setState({
        //                     copyrightList: res
        //                 })
        //                 Toast.success(successToast);
        //             }
        //         )
        //     }
        // }

        return (
            <div>
                <div style={styles.mainTitle}><b>Search Copyright</b></div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        const formData = new FormData(event.target);
                        const publicKey = formData.get("publicKey");

                        if (publicKey) {
                            this.props.searchNFT(publicKey).then(
                                res => {
                                    console.log("result List:", res);
                                    this.setState({
                                        copyrightList: res
                                    })
                                    Toast.success(successToast);
                                }
                            )
                            if(this.props.selectedAddress == publicKey){
                                this.setState({isAuthor: true});
                                console.log("selectedAddress:", this.props.selectedAddress);
                                console.log("publicKey:", publicKey);
                            }
                        }
                    }}
                >
                    <div className="form-group">
                        <label style={styles.inputTitle}>Public Key of Author: </label>
                        <input
                            style={styles.input1}
                            type="text"
                            className="form-control"
                            name="publicKey"
                            required
                        />
                    </div>
                    <div className="form-group" style={styles.spaceButton}>
                        <input className="btn btn-primary" type="submit" value="OK" style={styles.okButton} />
                    </div>
                    {/* <Button onClick={onClickSearchBtn}>Search</Button> */}
                </form>

                {
                    this.state.copyrightList.map((copyright) => {
                        // return (
                        //     <div className="row">
                        //         <div className="col-12">
                        //             {
                        //                 <Copyrights
                        //                     key={copyright.tokenID}
                        //                     copyRightURI={copyright.tokenURI}
                        //                     tokenID={copyright.tokenId}
                        //                 />
                        //             }
                        //         </div>
                        //     </div>
                        // )
                        return (
                            <div key={copyright.tokenId}>
                                <Card
                                    title={"copyright ID: "+copyright.tokenId}
                                    style={{ maxWidth: 512 }}
                                    shadows='always'
                                    headerExtraContent={
                                        <Text link={{ href: copyright.tokenURI, target:"_blank"}}>
                                            copyright Link
                                        </Text>
                                    }
                                    >
                                    <Space wrap>
                                        {<div>
                                            {this.state.isAuthor ? (
                                            <IsonSale
                                                NFTID={copyright.tokenId}
                                                setOnSaleState={(tokenID) => this.props.setOnSaleState(tokenID)}/>
                                            ) : (
                                            <IsonSale
                                                NFTID={copyright.tokenId}
                                                setOnSaleState={(tokenID) => this.props.setOnSaleState(tokenID)}/>
                                            // <Purchase
                                            //     NFTID={copyright.tokenId}
                                            //     purchaseNFT={(tokenID) => this.props.buyCopyright(tokenID)}/>
                                                )}
                                        </div>}
                                        <div>
                                            {/* <Tag>{`${copyright.tokenID}`}</Tag> */}
                                        </div>
                                    </Space>
                                </Card>
                            </div>
                        )
                    })
                }
            </div >
        );
    }
}
