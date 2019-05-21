package sqlmanip

import (
	"GuguTeamwork/utils"
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

func ConnetUserDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./SQLite3/GuguTeamwork.db")
	utils.CheckErr(err, "ConnectUserDB:open db")

	stmt, err := db.Prepare("PRAGMA synchronous = NORMAL;")
	utils.CheckErr(err, "ConnectUserDB:synchronous prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectUserDB:synchronous exec")

	stmt, err = db.Prepare("BEGIN TRANSACTION;")
	utils.CheckErr(err, "ConnectUserDB:transaction prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectUserDB:transaction exec")
	return db
}

func ConnectTaskDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./SQLite3/TaskTrees.db")
	utils.CheckErr(err, "ConnectTaskDB:open db")

	stmt, err := db.Prepare("PRAGMA synchronous = NORMAL;")
	utils.CheckErr(err, "ConnectTaskDB:synchronous prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectTaskDB:synchronous exec")

	stmt, err = db.Prepare("BEGIN TRANSACTION;")
	utils.CheckErr(err, "ConnectTaskDB:transaction prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectTaskDB:transaction exec")
	return db
}

func ConnectPersonalDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./SQLite3/UserInfor.db")
	utils.CheckErr(err, "ConnectPersonalDB:open db")

	stmt, err := db.Prepare("PRAGMA synchronous = NORMAL;")
	utils.CheckErr(err, "ConnectPersonalDB:synchronous prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectPersonalDB:synchronous exec")

	stmt, err = db.Prepare("BEGIN TRANSACTION;")
	utils.CheckErr(err, "ConnectPersonalDB:transaction prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectPersonalDB:transaction exec")
	return db
}

func ConnectTmpDB() *sql.DB {
	db, err := sql.Open("sqlite3", "./SQLite3/tmp.db")
	utils.CheckErr(err, "ConnectTmpDB:open db")

	stmt, err := db.Prepare("PRAGMA synchronous = NORMAL;")
	utils.CheckErr(err, "ConnectTmpDB:synchronous prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectTmpDB:synchronous exec")

	stmt, err = db.Prepare("BEGIN TRANSACTION;")
	utils.CheckErr(err, "ConnectTmpDB:transaction prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectTmpDB:transaction exec")
	return db
}

func DisConnectDB(db *sql.DB) {
	stmt, err := db.Prepare("COMMIT;")
	utils.CheckErr(err, "ConnectUserDB:commit prepare")
	_, err = stmt.Exec()
	utils.CheckErr(err, "ConnectUserDB:commit exec")
	db.Close()
}

func Try(db *sql.DB, openid string) bool {
	var tempStrA, tempStrB, tempStrC, tempStrD string
	var tempInt int
	err := db.QueryRow("SELECT * FROM UserInfo WHERE OpenId LIKE ?", openid).Scan(&tempStrA, &tempStrB, &tempInt, &tempStrC, &tempStrD)
	return utils.HasErr(err)
}
