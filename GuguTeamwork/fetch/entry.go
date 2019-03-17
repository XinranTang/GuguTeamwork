package fetch

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

const tryLoop = 3

func Entry(w http.ResponseWriter, r *http.Request) {
	db := sqlmanip.ConnetUserTable()
	defer sqlmanip.DisConnectDB(db)
	var output []byte
	ATencentRes := utils.GetOpenIdFromTencent(r.PostFormValue("code"))
	if ATencentRes.Errcode != 0 {
		var tryTime = 0
		if ATencentRes.Errcode == -1 {
			for ATencentRes.Errcode == -1 && tryTime < tryLoop {
				ATencentRes = utils.GetOpenIdFromTencent(r.PostFormValue("code"))
				tryTime++
			}
			if ATencentRes.Errcode == -1 {
				w.Write([]byte("-1:" + ATencentRes.Errmsg))
				return
			}
		} else {
			w.Write([]byte(strconv.Itoa(ATencentRes.Errcode) + ATencentRes.Errmsg))
			return
		}
	}
	if !try(db, ATencentRes.Openid) {
		output = exist(db, ATencentRes.Openid)
	} else {
		output = nonexsit(db, ATencentRes.Openid)
	}

	w.Header().Set("Content-type", "application/json")
	w.Write(output)
}

func try(db *sql.DB, openid string) bool {
	return sqlmanip.Try(db, openid)
}

func exist(db *sql.DB, openid string) []byte {
	UserInfo, err := sqlmanip.QueryUserInfo(db, openid)
	sqlmanip.RewriteAccessInfo(db, openid)

	output, err := json.MarshalIndent(UserInfo, "", "\t\t")
	utils.CheckErr(err)

	return output
}

func nonexsit(db *sql.DB, openid string) []byte {
	sqlmanip.CreateNewUser(db, openid)
	var UserInfo = utils.UserInfo{
		Messages:             nil,
		Tasks:                nil,
		Manage:               "",
		OpenId:               openid,
		LastTimeAccess:       time.Now(),
		SuccessiveAccessDays: 1,
		Level:                "lowLevel",
	}
	output, err := json.MarshalIndent(UserInfo, "", "\t\t")
	utils.CheckErr(err)

	return output
}
