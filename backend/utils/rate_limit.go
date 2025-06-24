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
		// If more than one minute has passed since the last insert, reset the count
		if time.Since(limitInfo.LastInsert) >= 1*time.Minute {
			limitInfo.Count = 1
			limitInfo.LastInsert = time.Now()
		} else {
			if limitInfo.Count >= 5 {
				Log("ERROR", "Rate limit exceeded for user: "+UserId)
				SendJSON(w, http.StatusTooManyRequests, JSONResponse{
					Success: false,
					Message: "You have exceeded the rate limit. Please try again later.",
				})
				return true
			}
			limitInfo.Count++
			limitInfo.LastInsert = time.Now()
		}
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
