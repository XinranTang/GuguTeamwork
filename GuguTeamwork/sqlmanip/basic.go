package sqlmanip

import (
	"GuguTeamwork/utils"
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func ConnetUserDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./SQLite3/GuguTeamwork.db")
	utils.CheckErr(err, "ConnectUserDB:open db")
	return db
}

func ConnectTaskDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./SQLite3/TaskTrees.db")
	utils.CheckErr(err, "ConnectTaskDB:open db")
	return db
}

func DisConnectDB(db *sql.DB) {
	db.Close()
}

func Try(db *sql.DB, openid string) bool {
	var tempStrA, tempStrB, tempStrC, tempStrD string
	var tempInt int
	err := db.QueryRow("SELECT * FROM UserInfo WHERE OpenId LIKE ?", openid).Scan(&tempStrA, &tempStrB, &tempInt, &tempStrC, &tempStrD)
	return utils.HasErr(err)
}
