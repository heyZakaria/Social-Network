package auth

import (
	"net/http"
	"strings"
	"time"

	"socialNetwork/utils"
)

func ParseForm(r *http.Request) (Profile, error) {
	var p Profile
	p.FirstName = r.FormValue("firstname")
	p.LastName = r.FormValue("lastname")
	p.Email = strings.ToLower(r.FormValue("email"))
	p.Password = r.FormValue("password")
	p.NickName = r.FormValue("nickname")
	p.Bio = r.FormValue("bio")
	p.Birthday, _ = time.Parse("2006-01-02", r.FormValue("birthday"))
	utils.Log("INFO", "Form fields parsed successfully")
	return p, nil
}
