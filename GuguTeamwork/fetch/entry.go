package fetch

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

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
		if ATencentRes.Errcode == 40029 {
			log.Println("40029")
			w.Write([]byte("40029:" + ATencentRes.Errmsg))
			return
		} else if ATencentRes.Errcode == 45011 {
			log.Println("40051")
			w.Write([]byte("40051:" + ATencentRes.Errmsg))
			return
		} else {
			for ATencentRes.Errcode == -1 && tryTime < tryLoop {
				ATencentRes = utils.GetOpenIdFromTencent(r.PostFormValue("code"))
				tryTime++
			}
			if ATencentRes.Errcode == -1 {
				log.Println("-1")
				w.Write([]byte("-1:" + ATencentRes.Errmsg))
				return
			}
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
	return nil
}
