import React from "react";

import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
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
        },
        buttonStyle: {
            width: 190,
            height: 50,
            backgroundColor: "white",
            fontSize: "20px",
            backgroundColor: "#a3d9f5",
            color: "black",
            marginLeft:"600px"
        },
        words: {
            fontSize: "50px",
            marginLeft: "300px"
        }
      };

    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-12 text-center">
                    {/* Metamask network should be set to Localhost:8545. */}
                    {networkError && (
                        <NetworkErrorMessage
                            message={networkError}
                            dismiss={dismiss}
                        />
                    )}
                </div>
                <div className="col-6 p-4 text-center">
                    <p style={styles.words}>Please connect to your wallet.</p>
                    <button
                        className="btn btn-warning"
                        type="button"
                        style={styles.buttonStyle}
                        onClick={connectWallet}
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        </div>
    );
}
