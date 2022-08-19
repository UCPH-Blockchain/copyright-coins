import React from "react";

export function Copyrights({ copyRightURI, tokenID }) {
    const styles = {
        copyrightMain: {
            padding: "20px",
            clear: "both",
            fontSize: "28px"
        },
        copyrightLeft: {
            float: "left"
        },
        copyrightRight: {
            float: "left",
            marginLeft: "350px"
        },
        buttonMain: {
            paddingLeft: "20px",
            paddingTop: "50px",
            clear: "both",
            paddingBottom: "50px"
        },
        buttonLeft: {
            float: "left",
            width: 120,
            height: 30,
            backgroundColor: "white",
            borderColor: "#cecfce"
        },
        buttonRight: {
            float: "left",
            marginLeft: "100px",
            width: 120,
            height: 30,
            backgroundColor: "white",
            borderColor: "#cecfce"
        }
      };
    return (
        <div>
            <div style={styles.copyrightMain}>
                <div style={styles.copyrightLeft}>
                    Copyright URL: {copyRightURI}
                </div>
                <div style={styles.copyrightRight}>
                    Token ID: {tokenID}
                </div>
            </div>
            <div style={styles.buttonMain}>
                <button type="button" style={styles.buttonLeft}>SELL</button>
                <button type="button" style={styles.buttonRight}>BUY</button>
            </div>
        </div>


    );
}