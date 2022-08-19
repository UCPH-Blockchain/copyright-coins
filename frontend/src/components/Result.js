import React from "react";

export function Result({ resultInfo }) {
    const styles = {
        result: {
            marginLeft: "465px",
            fontSize: "20px"
        }
      };
    return (
        <div>
            <label style={styles.result}><b>
            {resultInfo}</b>
            </label>

        </div>


    );
}