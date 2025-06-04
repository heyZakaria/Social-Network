package Group

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	db "socialNetwork/db/sqlite"

	"socialNetwork/auth"
	"socialNetwork/user"
	"socialNetwork/utils"
)

func createGroup(w http.ResponseWriter, r *http.Request) {
	token := auth.GetToken(w, r)
	if token == "" {
		return
	}
	user_id, err := user.GetUserIDByToken(token)
	if err != nil {
		utils.Log("Error Getting User Token", err.Error())
		utils.SendJSON(w, http.StatusUnauthorized, utils.JSONResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}
	utils.Log("INFO", "Received request for GroupCreation")
	err = r.ParseMultipartForm(10 << 20)
	if err != nil {
		utils.Log("ERROR", "Failed to parse multipart form: "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Invalid form data",
		})
		return
	}
	title := r.FormValue("Title")
	description := r.FormValue("Description")
	GroupcoverFileName, err := utils.HandleUploadImage(r, "Image", 3*1024*1024, "../uploads/groups_cover")
	if err != nil {
		utils.Log("ERROR", "Cover upload failed: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Cover upload failed",
		})
		return
	}
	Group := InitGroup(title, description, GroupcoverFileName, user_id)
	err = Group.InputValidation()
	if err != nil {
		utils.Log("ERROR", "Failed Input Validation : "+err.Error())
		utils.SendJSON(w, http.StatusBadRequest, utils.JSONResponse{
			Success: false,
			Error:   "Failed Input Validation",
		})
		return
	}
	utils.Log("INFO", "Group Input Validated")
	GroupId, err := Group.InsertGroup(db.DB)
	if err != nil {
		utils.Log("ERROR", "Failed to save group to DB: "+err.Error())
		utils.SendJSON(w, http.StatusInternalServerError, utils.JSONResponse{
			Success: false,
			Error:   "Failed to create Group",
		})
		return
	}
	utils.SendJSON(w, http.StatusOK, utils.JSONResponse{
		Success: true,
		Message: fmt.Sprintf("Group created successfully with ID %d", GroupId),
	})
	utils.Log("INFO", fmt.Sprintf("Group created successfully with ID: %d", GroupId))
}

func InitGroup(title string, descr string, coverName string, admId string) Group {
	return Group{
		Description: descr,
		Title:       title,
		CoverName:   coverName,
		AdminId:     admId,
	}
}

func (g Group) InputValidation() error {
	if len(g.Title) < 10 || len(g.Title) > 100 {
		return fmt.Errorf("Title must be between 10 and 100 characters")
	}
	if len(g.Description) < 30 || len(g.Description) > 250 {
		return fmt.Errorf("Description must be between 30 and 250 characters")
	}

	if strings.TrimSpace(g.Title) == "" {
		return errors.New("group title is required")
	}
	if g.AdminId == "" {
		return errors.New("admin ID is required")
	}

	// TODO: more Validation should be done
	return nil
}

func (g Group) InsertGroup(db *sql.DB) (int, error) {
	utils.Log("INFO", "Saving group into DB")
	stmt, err := db.Prepare(`
	INSERT INTO groups (title, descriptio, creator_id, covername)
	VALUES (?, ?, ?, ?)
`)
	if err != nil {
		return -1, fmt.Errorf("Failed to insert into Db : %s", err)
	}
	res, err := stmt.Exec(g.Title, g.Description, g.AdminId, g.CoverName)
	if err != nil {
		return -1, fmt.Errorf("Failed to insert into Db : %s", err)
	}
	GroupId, err := res.LastInsertId()
	if err != nil {
		return -1, fmt.Errorf("Error Getting GroupId : %s", err)
	}
	GroupIdToString := strconv.Itoa(int(GroupId))

	defer stmt.Close()

	_, err = InsertGroupMember(db, "Admin", GroupIdToString, g.AdminId)
	if err != nil {
		return -1, fmt.Errorf("Error Inserting GroupMember : %s", err)
	}
	return int(GroupId), nil
}

func InsertGroupMember(db *sql.DB, state string, groupId string, userId string) (int, error) {
	utils.Log("INFO", "Saving GroupMember into DB")
	stmt, err := db.Prepare(`INSERT INTO groupMember (user_id, group_id,memberState ) VALUES (? , ? , ?) `)
	if err != nil {
		return -1, err
	}
	defer stmt.Close()
	res, err := stmt.Exec(userId, groupId, state)
	if err != nil {
		return -1, fmt.Errorf("Failed to insert into Db : %s", err)
	}
	MemberId, err := res.LastInsertId()
	if err != nil {
		return -1, fmt.Errorf("Error Getting MemberGroup : %s", err)
	}

	return int(MemberId), nil
}
