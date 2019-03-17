package sqlmanip

import (
	"database/sql"
	"time"

	"GuguTeamwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func CreateNewUser(db *sql.DB, openid string) {
	//在用户表中添加新用户
	stmt, err := db.Prepare("INSERT INTO UserInfo(OpenId, LastTimeAccess, SuccessiveAccessDays, Level, Manage) VALUES(?, ?, ?, ?, ?)")
	utils.CheckErr(err)
	_, err = stmt.Exec(openid, time.Now().Format("2006-01-02T15:04:05Z"), 1, "lowLevel", "")
	utils.CheckErr(err)

	//为用户创建任务表和消息表
	var tableName = utils.DealWithOpenId(openid) + "_message"
	var order = "CREATE TABLE " + tableName + "(Title text not null, Pusher text not null, Content text not null, Status int not null, PushDate date not null, FinalDeleteDate date not null, MessageID text not null);"
	stmt, err = db.Prepare(order)
	utils.CheckErr(err)
	_, err = stmt.Exec()
	utils.CheckErr(err)

	tableName = utils.DealWithOpenId(openid) + "_task"
	order = "CREATE TABLE " + tableName + "(Title text not null, Pusher text not null, Content text not null, Status int not null, PushDate date not null, DeadLine date not null, Urgency int, TaskID text not null);"
	stmt, err = db.Prepare(order)
	utils.CheckErr(err)
	_, err = stmt.Exec()
	utils.CheckErr(err)

}
