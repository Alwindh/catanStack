import React, { useState, useEffect } from "react";
import "./App.css";
import "./index.css";

import { WebSocketImport } from "./websocket";

export default function CatanStack() {
	const [color, setColor] = useState("gray");
	const [dots, setDots] = useState(0);
	const [number, setNumber] = useState("?");
	const [init, setInit] = useState(false);
	const [rolling, setRolling] = useState(false);
	const [animating, setAnimating] = useState(false);
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
		setRolling(true);
		setAnimating(true);
		setTimeout(function () {
			setRolling(false);
		}, 1);
	}, [number, dots, color]);

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

	useEffect(() => {
		if (animating) {
			setTimeout(function () {
				setAnimating(false);
				setRolling(false);
			}, 1000);
		}
	}, [animating]);

	function rollDice() {
		if (!animating) {
			if (client.readyState === 1 && number !== "!" && number !== "?") {
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
	}

	function setError() {
		setColor("error");
		setDots(0);
		setNumber("!");
		setInit(false);
		setRolling(false);
	}

	if (rolling) {
		return (
			<div
				className={"avoid-clicks block gray"}
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
						style={{ fontSize: "0.5em", position: "absolute", marginTop: "20vh" }}
					>
						{". ".repeat(dots)}
					</div>
				</>
			</div>
		);
	} else {
		return (
			<>
				<div
					className="clickBlock"
					style={{
						width: "50%",
						height: "50%",
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
							style={{ fontSize: "0.5em", position: "absolute", marginTop: "20vh" }}
						>
							{". ".repeat(dots)}
						</div>
					</>
				</div>
			</>
		);
	}
}
