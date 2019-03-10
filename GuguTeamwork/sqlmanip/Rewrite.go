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
	utils.CheckErr(err)
	Date, err := time.Parse("2006-01-02T15:04:05Z", tempStr)
	utils.CheckErr(err)
	if Date.AddDate(0, 0, 1).Format("20060102") == time.Now().Format("20060102") {
		rewriteItemInt(db, openid, "SuccessiveAccessDays", tempInt+1)
		rewriteItemString(db, openid, "LastTimeAccess", time.Now().Format("2006-01-02T15:04:05Z"))
	} else if Date.Format("20060102") == time.Now().Format("20060102") {
	} else {
		rewriteItemInt(db, openid, "SuccessiveAccessDays", 1)
		rewriteItemString(db, openid, "LastTimeAccess", time.Now().Format("2006-01-02T15:04:05Z"))
	}
}

func rewriteItemInt(db *sql.DB, openid string, col string, newValue int) {
	order := "UPDATE UserInfo SET " + col + "=? WHERE OpenId=?"
	stmt, err := db.Prepare(order)
	utils.CheckErr(err)
	stmt.Exec(newValue, openid)
}

func rewriteItemString(db *sql.DB, openid string, col string, newValue string) {
	order := "UPDATE UserInfo SET " + col + "=? WHERE OpenId=?"
	stmt, err := db.Prepare(order)
	utils.CheckErr(err)
	stmt.Exec(newValue, openid)
}
