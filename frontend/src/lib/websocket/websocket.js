
export let socket = null;
export let broadcastChannel = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
	broadcastChannel = new window.BroadcastChannel("social_network_channel");
} else {
	broadcastChannel = null;
}
function getCookie(name) {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
	if (match) return match[2]
	return null
}

export const websocket = {
	send: (message) => {
		const token = getCookie('token');
		if (token === null || !token || token == "") {
			socket.close();
			document.location.href = "/login";
			return
		}
		message.token = token;
		if (socket?.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(message));
		} else {
			console.warn("WebSocket is not open. Cannot send message.");
		}
		message.token = null; // Clear token after sending
	},
};

export const isWebSocketOpen = () => {
	return socket?.readyState === WebSocket.OPEN;
};

export const closeWebSocket = () => {
	if (socket) {
		socket.close();
		console.log("WebSocket connection closed by client");
	}
};

export const OpenWebSocket = () => {
	// on message broadcast channel

	if (!socket || (socket.readyState !== WebSocket.OPEN && socket.readyState !== WebSocket.CONNECTING)) {
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		const socket = new WebSocket(`${protocol}://${window.location.host}/api/websocket/ws`);

		socket.onopen = () => {
			console.log("🟢  WebSocket connection established");
		};

		socket.onclose = () => {
			console.log("🔴 WebSocket connection closed");
		};
		socket.onerror = () => {
			console.log("🟠 WebSocket error occurred");
		};
	} else {
		console.warn("WebSocket is already open or connecting.", socket.readyState);
	}
}
