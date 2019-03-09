package sql

import (
	"database/sql"

	"GuguTeamwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func ConnetUserTable() *sql.DB {
	logger := utils.Logger()
	db, err := sql.Open("sqlite3", "./Users.db")
	utils.CheckErr(err)
	return db
}

func QueryString(db *sql.DB, key string) []string {

}
