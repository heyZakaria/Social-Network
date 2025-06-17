package realTime

import "net/http"

func WebSocketMux() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("/ws", WSHandler)                          // 	/groups/{id}/newEvent
	mux.HandleFunc("GET /Get_Chat_History", Get_Chat_History) // 	/groups/{id}/events

	return mux
}
