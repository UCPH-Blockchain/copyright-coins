import React from "react";

export function Transfer({ transferNFT, resultInfo }) {
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
            marginLeft: "300px",
            width: "500px",
            height: "30px",
            fontSize:"20px",
            marginTop: "40px"
        },
        input2: {
            marginLeft: "252px",
            width: "500px",
            height: "30px",
            fontSize:"20px",
            marginTop: "40px"
        },
        result: {
            marginLeft: "465px",
            fontSize: "20px"
        }
      };
    return (
        <div>
            <div style={styles.mainTitle}><b>Transfer Copyright</b></div>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const recipient = formData.get("recipient");
                    const tokenID = formData.get("tokenID");

                    if (recipient && tokenID) {
                        transferNFT(recipient, tokenID);
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
                    <label style={styles.inputTitle}>Recipent Address: </label>
                    <input
                        style={styles.input2}
                        type="text"
                        className="form-control"
                        name="recipent"
                        required
                    />
                </div>
                <div className="form-group" style={styles.spaceButton}>
                    <input className="btn btn-primary" type="submit" value="OK" style={styles.okButton}/>
                </div>
            </form>
            <label style={styles.result}><b>
            {resultInfo}</b>
            </label>

        </div>


    );
}