package utils

func GenerateChatSessionID(userID string, ReceiverID string) string {
	// IDs of users are uuid strings, so we can concatenate them
	// and sort them to ensure the session ID is consistent regardless of order
	if userID < ReceiverID {
		return userID + "_" + ReceiverID
	}
	return ReceiverID + "_" + userID
}
