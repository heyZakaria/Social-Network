package shared

import (
	"context"
	"net/http"
)

type contextKey string

// PS : unique typing is for security purpose => the custom typing making the context only accessible by the type itself
const UserIDKey contextKey = "userID"

func SetContext(r *http.Request, UserID string) context.Context {
	ctx := context.WithValue(r.Context(), UserIDKey, UserID)
	return ctx
	// Create a new context with the UserID
}
