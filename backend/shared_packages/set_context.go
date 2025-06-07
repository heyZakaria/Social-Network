package shared

import (
	"context"
	"net/http"
)

type contextKey string

const UserIDKey contextKey = "userID"

func SetContext(r *http.Request, UserID string) context.Context {
	ctx := context.WithValue(r.Context(), UserIDKey, UserID)
	return ctx
	// Create a new context with the UserID
}
