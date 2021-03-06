import React from "react";
import { useEffect } from "react";

function Authorised(props) {
	useEffect(() => {});
	return (
		<div className='page authorised'>
			<h3>Authorised ✅</h3>
			<br />
			<br />
			<span>
				<strong>
					{props.user && props.user.email.split("@")[0].slice(0, -2)}
				</strong>{" "}
				Open the{" "}
				<a href='https://discord.com/channels/694190268424912936/694191262424760390'>
					discord app/website
				</a>{" "}
				and have a blast at the IIIT Pune server! Redirect to Discord
				<br />
				You may close the tab now.
			</span>
		</div>
	);
}

export default Authorised;
