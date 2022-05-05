import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";

import { WebSocketImport } from "./websocket";

export default function CatanStack() {
	const [color, setColor] = useState("gray");
	const [dots, setDots] = useState(0);
	const [number, setNumber] = useState("?");
	const [init, setInit] = useState(false);
	let client = WebSocketImport();

	useEffect(() => {
		if (client.webSocket) {
			client.webSocket.onmessage = (message) => {
				if (message.data.length === undefined) {
					setColor("gray");
					setDots(0);
					setNumber("?");
				} else {
					const incData = JSON.parse(message.data);
					setColor(incData.color);
					setDots(incData.dots);
					setNumber(incData.number);
				}
			};
		}
	}, [client]);

	useEffect(() => {
		if (client.readyState !== 1 && init) {
			setError();
		}
	}, [client, init]);

	useEffect(() => {
		if (!init && client.readyState === 1) {
			client.sendMessage(
				JSON.stringify({
					rollDice: false,
				})
			);
			setInit(true);
		}
	}, [init, client]);

	function rollDice() {
		console.log(client.readyState);
		if (client.readyState === 1 && number !== "!") {
			client.sendMessage(
				JSON.stringify({
					rollDice: true,
				})
			);
		} else {
			setError();
			client.sendMessage(
				JSON.stringify({
					rollDice: false,
				})
			);
		}
	}

	function setError() {
		setColor("gray");
		setDots(0);
		setNumber("!");
		setInit(false);
	}

	return (
		<>
			<div
				className="clickBlock"
				style={{
					width: "52%",
					height: "52%",
					position: "absolute",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				onClick={rollDice}
			></div>
			<div
				className={"avoid-clicks block " + color}
				style={{
					width: "50%",
					height: "50%",
					fontSize: "10em",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<>
					<div className={"text avoid-clicks"}>{number.toString()}</div>
					<div
						className={"text avoid-clicks"}
						style={{ fontSize: "0.6em", position: "absolute", marginTop: "20vh" }}
					>
						{". ".repeat(dots)}
					</div>
				</>
			</div>
		</>
	);
}
