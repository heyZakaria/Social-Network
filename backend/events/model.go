package Events

type Event struct {
	Title         string `json:"title"`
	Description   string `json:"description"`
	DayOfEvent    string `json:"date"`
	TimeOfEvent   string `json:"time"`
	EventLocation string `json:"location"`
	GroupID       int    `json:"group_id"`
	Creator       string
}
