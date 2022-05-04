import { useState } from "react";
import useWebSocket from "react-use-websocket";

export const WebSocketImport = () => {
	//Public API that will echo messages sent to it back to the client
	const [socketUrl, setSocketUrl] = useState(
		window.location.protocol === "http:"
			? "ws://" + window.location.hostname + ":8081"
			: "wss://" + window.location.hostname + ":8081"
	);
	const [webSocket, setWebSocket] = useState();

	const { sendMessage, sendJsonMessage, lastMessage, lastJsonMessage, readyState, getWebSocket } = useWebSocket(
		socketUrl,
		{
			onOpen: () => {
				setWebSocket(getWebSocket());
			},
			//Will attempt to reconnect on all close events, such as server shutting down
			shouldReconnect: (closeEvent) => true,
		}
	);

	return {
		readyState: readyState,
		sendMessage: sendMessage,
		webSocket: webSocket,
	};
};
