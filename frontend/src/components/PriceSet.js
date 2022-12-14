import React from "react";

import { Toast } from "@douyinfe/semi-ui";

export function PriceSet({ setPrice }) {
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
            backgroundColor:"#a3d9f5",
            color: "black",
            marginLeft: "410px",
            marginTop: "30px",
            height: 30,
            fontSize: "18px"
        },
        input1: {
            marginLeft: "298px",
            width: "500px",
            height: "30px",
            fontSize:"20px",
            marginTop: "40px"
        },
        input2: {
            marginLeft: "367px",
            width: "500px",
            height: "30px",
            fontSize:"20px",
            marginTop: "40px"
        },
      };
    return (
        <div>
            <div style={styles.mainTitle}><b>Set Price for Copyright</b></div>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const tokenID = formData.get("tokenID");
                    const price = formData.get("price");

                    if (tokenID && price) {
                        setPrice(tokenID, price).then(res => {
                            console.log("setPrice:", res);
                            Toast.success({
                                content: "Set Price Successfully",
                                duration: 3,
                            });
                        }).catch(err => {
                            Toast.error({
                                content: "Set Price Failed\n" + err,
                                duration: 0,
                            });
                        });
                    }
                }}
            >
                <div className="form-group">
                    <label style={styles.inputTitle}>Copyright ID: </label>
                    <input
                        style={styles.input1}
                        type="text"
                        className="form-control"
                        name="tokenID"
                        required
                    />
                </div>
                <div className="form-group">
                    <label style={styles.inputTitle}>Price: </label>
                    <input
                        style={styles.input2}
                        type="text"
                        className="form-control"
                        name="price"
                        required
                    />
                </div>
                <div className="form-group" style={styles.spaceButton}>
                    <input className="btn btn-primary" type="submit" value="OK" style={styles.okButton}/>
                </div>
            </form>
        </div>


    );
}