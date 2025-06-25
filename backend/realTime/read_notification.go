package realTime

import (
	"net/http"

	db "socialNetwork/db/sqlite"
	shared "socialNetwork/shared_packages"
	"socialNetwork/utils"
)

func MarkAllAsRead(w http.ResponseWriter, r *http.Request) {
	userIDVal := r.Context().Value(shared.UserIDKey)
	userID, ok := userIDVal.(string)
	if !ok || userID == "" {
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Message: "Unauthorized or missing user ID",
		})
		return
	}

	_, err := db.DB.Exec(`
		UPDATE notifications
		SET is_read = TRUE
		WHERE user_id = ? AND is_read = FALSE
	`, userID)
	if err != nil {
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Message: "Failed to update notifications",
			Error:   err.Error(),
		})
		return
	}

	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: "Notifications marked as read",
	})
}
