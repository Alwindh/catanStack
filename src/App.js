import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import { WebSocketImport } from "./websocket";

export default function CatanStack() {
	const [rolling, setRolling] = useState(false);
	const [color, setColor] = useState("gray");
	const [dots, setDots] = useState(0);
	const [number, setNumber] = useState("?");
	const [init, setInit] = useState(false);
	let client = WebSocketImport();

	useEffect(() => {
		if (client.webSocket) {
			client.webSocket.onmessage = (message) => {
				if (message.data.length) {
					console.log(message.data.length);
					const incData = JSON.parse(message.data);
					setColor(incData.color);
					setDots(incData.dots);
					setNumber(incData.number);
					setRolling(false);
				}
			};
			if (number === 0) {
			}
		}
	}, [client, number]);

	useEffect(() => {
		if (!init) {
			client.sendMessage(
				JSON.stringify({
					rollDice: false,
				})
			);
			setInit(true);
		}
	}, [init, client]);

	function rollDice() {
		if (!rolling) {
			setRolling(true);
			client.sendMessage(
				JSON.stringify({
					rollDice: true,
				})
			);
		}
	}

	function setThingy() {
		if (rolling) {
			return "";
		} else {
			return (
				<>
					<div className={"text avoid-clicks"}>{number.toString()}</div>
					<div
						className={"text avoid-clicks"}
						style={{ fontSize: "0.6em", position: "absolute", marginTop: "20vh" }}
					>
						{". ".repeat(dots)}
					</div>
				</>
			);
		}
	}

	return (
		<>
			<div
				onClick={rollDice}
				style={{
					width: "100%",
					height: "100%",
					position: "absolute",
				}}
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
				{setThingy()}
			</div>
		</>
	);
}
