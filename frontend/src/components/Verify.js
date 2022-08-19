import React from "react";

export function Verify({ verifyNFT }) {
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
        input2: {
            marginLeft: "288px",
            width: "500px",
            height: "30px",
            fontSize: "20px",
            marginTop: "40px"
        },
    };
    return (
        <div>
            <div style={styles.mainTitle}><b>Verify Copyright</b></div>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const publicKey = formData.get("publicKey");
                    const copyrightURI = formData.get("copyrightURI");

                    if (publicKey && copyrightURI) {
                        const res = verifyNFT(publicKey, copyrightURI);
                        console.log(res);
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
                <div className="form-group">
                    <label style={styles.inputTitle}>Copyright URI: </label>
                    <input
                        style={styles.input2}
                        type="text"
                        className="form-control"
                        name="copyrightURI"
                        required
                    />
                </div>
                <div className="form-group" style={styles.spaceButton}>
                    <input className="btn btn-primary" type="submit" value="VERIFY" style={styles.okButton} />
                </div>
            </form>
        </div>
    );
}