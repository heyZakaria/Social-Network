package Event

type Event struct {
	ID            int    `json:"id"`
	Title         string `json:"title"`
	Description   string `json:"description"`
	DateOfEvent   string `json:"date"`
	EventLocation string `json:"location"`
	GroupID       int    `json:"group_id"`
	Creator       string
	CreatedAt     string
}

type Events []Event
