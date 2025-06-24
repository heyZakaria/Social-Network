package Shared_groups

import (
	"fmt"
	db "socialNetwork/db/sqlite"
)

func GetMembersOfGroup(groupId string, userId string) (groupMembers []GroupMember, err error) {
	query := `
		SELECT u.first_name, u.last_name, u.id, u.avatar , gm.memberState
		FROM groupMember gm
		JOIN users u ON u.id = gm.user_id
		WHERE gm.group_id = ? AND gm.memberState IN ('Member', 'Admin') 
		ORDER BY u.first_name
	`

	rows, err := db.DB.Query(query, groupId, userId)
	if err != nil {
		err = fmt.Errorf("failed to query group members: %w", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var gm GroupMember
		if err := rows.Scan(&gm.FirstName, &gm.LastName, &gm.User_id, &gm.Avatar, &gm.Role); err != nil {
			err = fmt.Errorf("failed to scan group member: %w", err)
			return nil, err
		}
		groupMembers = append(groupMembers, gm)
	}
	return groupMembers, nil
}
