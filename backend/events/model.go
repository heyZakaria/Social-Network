package Events

import "time"

type Event struct {
	Title       string    `json:"title"`
	Description string    `json:"description"`
	DayOfEvent  time.Time `json:"dayofevent"`
}
