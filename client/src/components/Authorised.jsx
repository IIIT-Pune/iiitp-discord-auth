import React from "react";
import { useEffect } from "react";

function Authorised(props) {
    useEffect(() => {});
    return (
        <div className="page authorised">
            <h3>Authorised ✅</h3>
            <br />
            <br />
            <span>
                <strong>
                    {props.user && props.user.email.split("@")[0].slice(0, -2)}
                </strong>{" "}
                You may close the tab now
            </span>
        </div>
    );
}

export default Authorised;
