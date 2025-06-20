package shared

import (
	"database/sql"
	"fmt"
)

func ValidateGroup(Db *sql.DB, GroupId string, UserId string) (bool, bool, error) {
	var groupExist, memberExist bool
	fmt.Println(GroupId)
	CheckGroupQuery := "SELECT EXISTS(SELECT 1 FROM groups WHERE id = ?)"
	err := Db.QueryRow(CheckGroupQuery, GroupId).Scan(&groupExist)
	if err != nil {
		return false, false, fmt.Errorf("error checking group existence: %w", err)
	}

	CheckGroupMemberQuery := "SELECT EXISTS(SELECT 1 FROM groupMember WHERE user_id = ? AND group_id = ?)"
	err = Db.QueryRow(CheckGroupMemberQuery, UserId, GroupId).Scan(&memberExist)
	if err != nil {
		return groupExist, false, fmt.Errorf("error checking group membership: %w", err)
	}

	return groupExist, memberExist, nil
}
