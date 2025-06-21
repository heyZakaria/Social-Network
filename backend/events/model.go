package Event

type Event struct {
	ID            int    `json:"id"`
	Title         string `json:"title"`
	Description   string `json:"description"`
	DateOfEvent   string `json:"date"`
	EventLocation string `json:"location"`
	GroupID       int    `json:"group_id"`
	GroupName     string `json:"group_name"`
	Creator       string `json:"organizer"`
	Attendees     int `json:"attendees"`
	CreatedAt     string
}

type Events []Event

type EventResponse struct {
	Group_id string `json:"group_id"`
	Event_id int `json:"event_id"`
	Presence string `json:"presence"`
}
