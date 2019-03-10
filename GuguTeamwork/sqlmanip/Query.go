package sqlmanip

import (
	"database/sql"
	"time"

	"GuguTeamwork/utils"

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
	err := db.QueryRow("SELECT * FROM UserInfo WHERE OpenId LIKE ?", openid).Scan()
	return utils.HasErr(err)
}

func QueryUserInfo(db *sql.DB, openid string) (*utils.UserInfo, error) {
	var AUserInfo utils.UserInfo
	var Astring, Bstring string

	//填充登陆时间信息
	var order = "SELECT OpenId,LastTimeAccess,SuccessiveAccessDays,Level FROM UserInfo WHERE OpenId LIKE '" + openid + "';"
	err := db.QueryRow(order).Scan(&AUserInfo.OpenId, &Astring, &AUserInfo.SuccessiveAccessDays, &AUserInfo.Level)
	utils.CheckErr(err)
	AUserInfo.LastTimeAccess, err = time.Parse("2006-01-02T15:04:05Z", Astring)
	utils.CheckErr(err)

	//填充消息和任务信息
	var AMessage utils.Message
	order = "SELECT Title,Pusher,Content,Status,PushDate,FinalDeleteDate FROM " + openid + "_message;"
	rows, err := db.Query(order)
	utils.CheckErr(err)

	for rows.Next() {
		err = rows.Scan(&AMessage.Title, &AMessage.Pusher, &AMessage.Content, &AMessage.Status, &Astring, &Bstring)
		utils.CheckErr(err)
		AMessage.PushDate, err = time.Parse("2006-01-02T15:04:05Z", Astring)
		utils.CheckErr(err)
		AMessage.FinalDeleteDate, err = time.Parse("2006-01-02T15:04:05Z", Bstring)
		utils.CheckErr(err)
		AUserInfo.Messages = append(AUserInfo.Messages, AMessage)
	}

	var ATask utils.Task
	order = "SELECT Title,Pusher,Content,Status,PushDate,DeadLine,Urgency FROM " + openid + "_task;"
	rows, err = db.Query(order)
	utils.CheckErr(err)

	for rows.Next() {
		err = rows.Scan(&ATask.Title, &ATask.Pusher, &ATask.Content, &AMessage.Status, &Astring, &Bstring, &ATask.Urgency)
		utils.CheckErr(err)
		ATask.PushDate, err = time.Parse("2006-01-02T15:04:05Z", Astring)
		utils.CheckErr(err)
		ATask.DeadLine, err = time.Parse("2006-01-02T15:04:05Z", Bstring)
		utils.CheckErr(err)
		AUserInfo.Tasks = append(AUserInfo.Tasks, ATask)
	}

	return &AUserInfo, nil
}
