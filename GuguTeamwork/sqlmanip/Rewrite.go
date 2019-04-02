package sqlmanip

import (
	"database/sql"
	"time"

	"GuguTeamwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func RewriteAccessInfo(db *sql.DB, openid string) {
	var tempStr string
	var tempInt int
	err := db.QueryRow("SELECT LastTimeAccess,SuccessiveAccessDays FROM UserInfo WHERE OpenId LIKE ?", openid).Scan(&tempStr, &tempInt)
	utils.CheckErr(err, "RewriteAccessInfo:Query")
	Date, err := time.Parse("2006-01-02T15:04:05Z", tempStr)
	utils.CheckErr(err, "RewriteAccessInfo:Time parsing")
	if Date.AddDate(0, 0, 1).Format("20060102") == time.Now().Format("20060102") {
		err = rewriteItemInt(db, UserInfo, openid, "SuccessiveAccessDays", tempInt+1)
		utils.CheckErr(err, "RewriteAccessInfo:write int")
		err = rewriteItemString(db, UserInfo, openid, "LastTimeAccess", time.Now().Format("2006-01-02T15:04:05Z"))
		utils.CheckErr(err, "RewriteAccessInfo:write string")
	} else if Date.Format("20060102") == time.Now().Format("20060102") {
	} else {
		err = rewriteItemInt(db, UserInfo, openid, "SuccessiveAccessDays", 1)
		utils.CheckErr(err, "RewriteAccessInfo:write int")
		err = rewriteItemString(db, UserInfo, openid, "LastTimeAccess", time.Now().Format("2006-01-02T15:04:05Z"))
		utils.CheckErr(err, "RewriteAccessInfo:write string")
	}
}

func rewriteItemInt(db *sql.DB, table string, openid string, header string, newValue int) error {
	order := "UPDATE ? SET ?=? WHERE OpenId=?"
	stmt, err := db.Prepare(order)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(table, header, newValue, openid)
	if err != nil {
		return err
	}
	return nil
}

func rewriteItemString(db *sql.DB, table string, openid string, header string, newValue string) error {
	order := "UPDATE ? SET ?=? WHERE OpenId=?"
	stmt, err := db.Prepare(order)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(table, header, newValue, openid)
	if err != nil {
		return err
	}
	return nil
}
