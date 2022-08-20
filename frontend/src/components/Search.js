import React from "react";
import { Copyrights } from "./Copyrights";

export class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            publicKey: "",
            copyrightList: [],
        };
    }

    render() {
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
                </form>

                {this.state.copyrightList.map((copyright) => {
                    return (
                        <div className="row">
                            <div className="col-12">
                                {
                                    <Copyrights
                                        key = {copyright.tokenID}
                                        copyRightURI={copyright.tokenURI}
                                        tokenID={copyright.tokenId}
                                    />
                                }
                            </div>
                        </div>
                    )
                })}

            </div>


        );
    }
}
