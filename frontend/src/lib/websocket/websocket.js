
export let socket = null;
export let broadcastChannel = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
	broadcastChannel = new window.BroadcastChannel("social_network_channel");
} else {
	broadcastChannel = null;
}

export const websocket = {
	send: async (message) => {
		if (socket?.readyState === WebSocket.OPEN) {
			socket.send(JSON.stringify(message));
		} else {
			console.warn("WebSocket is not open. Cannot send message.");
		}
	},
};

export const isWebSocketOpen = () => {
	return socket?.readyState === WebSocket.OPEN;
};

export const closeWebSocket = () => {
	if (socket) {
		socket.close();

	}
};

export const OpenWebSocket = () => {
	// on message broadcast channel

 if (!socket || (socket.readyState !== WebSocket.OPEN && socket.readyState !== WebSocket.CONNECTING)) {
    socket = new WebSocket(`/api/websocket/ws`);
	// In Next.js, BroadcastChannel is only available in the browser.
	
    socket.onopen = () => {

    };

    socket.onclose = () => {

    };
    
 } else {
  console.warn("WebSocket is already open or connecting.", socket.readyState);
 }
}