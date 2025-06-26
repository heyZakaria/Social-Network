package Event

type Event struct {
	ID            string    `json:"id"`
	Title         string `json:"title"`
	Description   string `json:"description"`
	DateOfEvent   string `json:"date"`
	EventLocation string `json:"location"`
	GroupID       string `json:"group_id"`
	GroupName     string `json:"group_name"`
	Creator       string `json:"organizer"`
	Attendees     int    `json:"attendees"`
	CreatedAt     string
}

type Events []Event

type EventResponse struct {
	Group_id string `json:"group_id"`
	Event_id string    `json:"event_id"`
	Presence string `json:"presence"`
}
