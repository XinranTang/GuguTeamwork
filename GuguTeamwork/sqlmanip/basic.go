package sqlmanip

import (
	"GuguTeamwork/utils"
	"database/sql"

	//_ "github.com/jinzhu/gorm/dialects/sqlite"
	_ "github.com/go-sql-driver/mysql"
)

func ConnetUserDB() *sql.DB {
	//db, err := sql.Open("sqlite3", "./SQLite3/GuguTeamwork.db")
	db, err := sql.Open("mysql", "root:FractureSR1998@NEU@tcp(localhost:3306)/GuguTeamwork?charset=utf8")
	utils.CheckErr(err, "ConnectUserDB:open db")
	return db
}

func ConnectTaskDB() *sql.DB {
	//db, err := sql.Open("sqlite3", "./SQLite3/TaskTrees.db")
	db, err := sql.Open("mysql", "root:FractureSR1998@NEU@tcp(localhost:3306)/TaskTrees?charset=utf8")
	utils.CheckErr(err, "ConnectTaskDB:open db")
	return db
}

func ConnectPersonalDB() *sql.DB {
	//db, err := sql.Open("sqlite3", "./SQLite3/UserInfor.db")
	db, err := sql.Open("mysql", "root:FractureSR1998@NEU@tcp(localhost:3306)/UserInfor?charset=utf8")
	utils.CheckErr(err, "ConnectPersonalDB:open db")
	return db
}

func ConnectTmpDB() *sql.DB {
	//db, err := sql.Open("sqlite3", "./SQLite3/tmp.db")
	db, err := sql.Open("mysql", "root:FractureSR1998@NEU@tcp(localhost:3306)/tmp?charset=utf8")
	utils.CheckErr(err, "ConnectTmpDB:open db")
	return db
}

func DisConnectDB(db *sql.DB) {
	db.Close()
}

func Try(db *sql.DB, openid string) bool {
	var tempStrA, tempStrB, tempStrC, tempStrD, tempStrE, tempStrF string
	var tempInt int
	err := db.QueryRow("SELECT * FROM UserInfo WHERE OpenId LIKE ?", openid).Scan(&tempStrA, &tempStrB, &tempInt, &tempStrC, &tempStrD, &tempStrE, &tempStrF)
	return utils.HasErr(err)
}
