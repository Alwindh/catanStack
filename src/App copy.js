import React, { Component } from "react";
import "./App.css";
import "./index.css";

export default class startPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			deck: [],
			curValue: "?",
			dots: {},
			curDots: "",
			rolling: false,
			blue: true,
		};
	}

	componentDidMount() {
		this.createDeck();
	}

	createDeck() {
		let cardDeck = [];
		for (let dice1 = 1; dice1 < 7; dice1++) {
			for (let dice2 = 1; dice2 < 7; dice2++) {
				cardDeck.push(dice1 + dice2);
			}
		}
		this.setState({ deck: cardDeck });
		if (this.state.dots[2] === undefined) {
			this.getDots(cardDeck);
		}
	}

	getDots(deck) {
		let dots = {};
		deck.forEach((element) => {
			if (dots[element] === undefined) {
				dots[element] = 1;
			} else {
				dots[element] += 1;
			}
		});
		this.setState({ dots: dots });
	}

	randomNumber() {
		let min = 0;
		let max = this.state.deck.length;
		return Math.floor(Math.random() * (max - min)) + min;
	}

	async drawCard() {
		this.setState({ rolling: true, curValue: "", curDots: "" });
		let deckNumber = this.randomNumber();
		let number = this.state.deck[deckNumber];
		let newDeck = this.state.deck;
		let dotString = "";
		for (let dots = 0; dots < this.state.dots[number]; dots++) {
			dotString += ".";
		}
		newDeck.splice(deckNumber, 1);
		if (this.state.deck.length === 0) {
			this.createDeck();
		}
		this.setState({ curValue: String(number) });

		await new Promise((r) => setTimeout(r, 1));

		this.setState({ rolling: false, curDots: dotString, blue: !this.state.blue });
	}

	setThingy() {
		if (this.state.rolling) {
			return "";
		} else {
			return (
				<>
					<div className={"text"}>{this.state.curValue}</div>
					<div className={"text"} style={{ fontSize: "0.6em", position: "absolute", marginTop: "20vh" }}>
						{this.state.curDots}
					</div>
				</>
			);
		}
	}

	render() {
		return (
			<>
				<div
					onClick={() => {
						this.drawCard();
					}}
					style={{
						width: "100%",
						height: "100%",
						position: "absolute",
					}}
				></div>
				<div
					className={
						this.state.rolling
							? "shadow avoid-clicks gray"
							: this.state.blue
							? "shadow avoid-clicks blue"
							: "shadow avoid-clicks red"
					}
					style={{
						width: "50%",
						height: "50%",
						fontSize: "10em",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{this.setThingy()}
				</div>
			</>
		);
	}
}
