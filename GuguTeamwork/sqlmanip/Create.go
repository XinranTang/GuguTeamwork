package sqlmanip

import (
	"database/sql"
	"time"

	"GuguTeamwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func CreateNewUser(db *sql.DB, openid string) {
	//在用户表中添加新用户
	stmt, err := db.Prepare("INSERT INTO UserInfo(OpenId, LastTimeAccess, SuccessiveAccessDays, Level, Manage, Messages, Tasks) VALUES(?, ?, ?, ?, ? ,? ,?)")
	utils.CheckErr(err, "CreateNewUser:prepare")
	_, err = stmt.Exec(openid, time.Now().Format("2006-01-02T15:04:05Z"), 1, "lowLevel", "", "", "")
	utils.CheckErr(err, "CreateNewUser:exec")
}

func CreateTask(db *sql.DB, task *utils.Task, openid string) {
	strTask, err := QueryOpenIdToString(db, "Tasks", "UserInfo", openid)
	utils.CheckErr(err, "CreateTask:query")

	err = RewriteItemString(db, "UserInfo", openid, "Tasks", strTask+task.TaskID+";")
	utils.CheckErr(err, "CreateTask:append task")

	stmt, err := db.Prepare("INSERT INTO TaskToPeople(TaskID,Receiver) VALUES(?,?)")
	utils.CheckErr(err, "CreateTask:insert into TaskToPeople prepare")
	_, err = stmt.Exec(task.TaskID, openid)
	utils.CheckErr(err, "CreateTask:insert into TaskToPeople exec")

	stmt, err = db.Prepare("INSERT INTO Tasks(TaskID, Title, Pusher, Content, Status, PushDate, DeadLine, Urgency) Values(?,?,?,?,?,?,?,?)")
	utils.CheckErr(err, "CreateTask:insert into Tasks prepare")
	_, err = stmt.Exec(task.TaskID, task.Title, task.Pusher, task.Content, task.Status, task.PushDate, task.DeadLine, task.Urgency)
}
