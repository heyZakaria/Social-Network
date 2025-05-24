package utils

import (
	"net/http"
	"time"
)

type LimitInfo struct {
	UserID     string    `json:"ip"`
	Count      int       `json:"count"`
	LastInsert time.Time `json:"last_insert"`
}

func CheckRateLimit(RateLimit map[string]LimitInfo, UserId string, w http.ResponseWriter) bool {
	if limitInfo, exists := RateLimit[UserId]; exists {
		if limitInfo.Count >= 5 && time.Since(limitInfo.LastInsert) < 1*time.Minute {
			Log("ERROR", "Rate limit exceeded for user: "+UserId)
			SendJSON(w, http.StatusTooManyRequests, JSONResponse{
				Success: false,
				Message: "You have exceeded the rate limit for creating posts. Please try again later.",
			})
			return true
		}
		// Update the count and last insert time
		limitInfo.Count++
		limitInfo.LastInsert = time.Now()
		RateLimit[UserId] = limitInfo
	} else {
		// Initialize the rate limit for the user
		RateLimit[UserId] = LimitInfo{
			UserID:     UserId,
			Count:      1,
			LastInsert: time.Now(),
		}
	}
	return false
}
