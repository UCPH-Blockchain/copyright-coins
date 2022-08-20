import React from "react";
import { Toast, Card, Typography, Space, Button } from "@douyinfe/semi-ui";
// import { Copyrights } from "./Copyrights";

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: "",
            copyrightList: [],
            isAuthor: false,
            isOnsale: false,
        };
        this.OnSaleClick = this.OnSaleClick.bind(this);
        this.NotOnSaleClick = this.NotOnSaleClick.bind(this);
    }

    OnSaleClick() {
        this.setState({isOnsale: true});
        console.log("set copyright is on sale");
        console.log(this.isOnsale);
    }
    
    NotOnSaleClick() {
        this.setState({isOnsale: false});
        console.log("set copyright is not on sale");
        console.log(this.isOnsale);
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

        const isOnsale = this.state.isOnsale;
        let isOnsaleButton;
        if (isOnsale) {
            isOnsaleButton = <Button onClick={this.OnSaleClick} />;
        } else {
            isOnsaleButton = <Button onClick={this.NotOnSaleClick} />;
        }


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
                                    console.log("copyrightList:", res);
                                    this.setState({
                                        copyrightList: res
                                    })
                                    Toast.success(successToast);
                                }
                            )
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
                            <div key={copyright.tokenID}>
                                <Card
                                    title={"copyright ID: "+copyright.tokenId}
                                    style={{ maxWidth: 512 }}
                                    shadows='always'
                                    headerExtraContent={
                                        <Text link={{ href: copyright.tokenURI}}>
                                            copyright Link
                                        </Text>
                                    }
                                    >
                                    <Space wrap>
                                        {<div>
                                            {this.state.isAuthor ? (
                                            <div className="btn-margin-right">
                                            <Button>BUY</Button></div>
                                            ) : (
                                            <div className="btn-margin-right">
                                            <Button>BUY2</Button></div>)}
                                        </div>}
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
