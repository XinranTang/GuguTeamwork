package sqlmanip

import (
	"GuguTeamwork/utils"
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func ConnetUserTable() *sql.DB {
	db, err := sql.Open("sqlite3", "./SQLite3/GuguTeamwork.db")
	utils.CheckErr(err)
	return db
}

func DisConnectDB(db *sql.DB) {
	db.Close()
}

func Try(db *sql.DB, openid string) bool {
	var tempStrA, tempStrB, tempStrC string
	var tempInt int
	err := db.QueryRow("SELECT * FROM UserInfo WHERE OpenId LIKE ?", openid).Scan(&tempStrA, &tempStrB, &tempInt, &tempStrC)
	return utils.HasErr(err)
}
