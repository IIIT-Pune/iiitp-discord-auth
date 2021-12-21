import React from "react";
import { useEffect } from "react";

import { getAuth } from "firebase/auth";

const auth = getAuth();
function Authorised(props) {
    useEffect(() => {});
    return (
        <div className='page authorised'>
            <h3>Authorised ✅</h3>
            <br />
            <br />
            <span>
                <strong>{auth.currentUser?.displayName}</strong> Open the{" "}
                <a href='https://discord.com/channels/694190268424912936/694191262424760390'>
                    discord app/website
                </a>{" "}
                and have a blast at the IIIT Pune server!
                <br />
                You may close the tab now.
            </span>
        </div>
    );
}

export default Authorised;
