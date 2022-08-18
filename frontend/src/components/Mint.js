import React from "react";

export function Mint({ mintNFT }) {
    return (
        <div>
            <h1>Mint</h1>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    const formData = new FormData(event.target);
                    const recipient = formData.get("recipient");
                    const tokenURI = formData.get("tokenURI");

                    if (recipient && tokenURI) {
                        mintNFT(recipient, tokenURI);
                    }
                }}
            >
                <div className="form-group">
                    <label>Recipent address</label>
                    <input
                        type="text"
                        className="form-control"
                        name="recipient"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Token URI</label>
                    <input
                        type="text"
                        className="form-control"
                        name="tokenURI"
                        required
                    />
                </div>
                <div className="form-group">
                    <input className="btn btn-primary" type="submit" value="Mint" />
                </div>
            </form>

        </div>
    );
}