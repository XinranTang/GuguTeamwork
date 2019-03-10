package fetch

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

func Entry(w http.ResponseWriter, r *http.Request) {
	db := sqlmanip.ConnetUserTable()
	defer sqlmanip.DisConnectDB(db)
	var output []byte
	if try(db, r.PostFormValue("OpenId")) {
		output = exist(db, r.PostFormValue("OpenId"))
	} else {
		//		output = nonexsit(db, r.PostFormValue("OpenId"))
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

/*func nonexsit(db *sql.DB, openid string) []byte {

}*/
