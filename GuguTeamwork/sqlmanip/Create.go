package sqlmanip

import (
	"database/sql"
	"time"

	"GuguTeamwork/utils"
)

func CreateNewUser(db *sql.DB, openid string) {
	//在用户表中添加新用户
	stmt, err := db.Prepare("INSERT INTO UserInfo(OpenId, LastTimeAccess, SuccessiveAccessDays, Level, Manage, Messages, Tasks) VALUES(?, ?, ?, ?, ? ,? ,?)")
	utils.CheckErr(err, "CreateNewUser:prepare")
	_, err = stmt.Exec(openid, time.Now().Format("2006-01-02 15:04:05"), 1, "lowLevel", "", "", "")
	utils.CheckErr(err, "CreateNewUser:exec")
}

func CreateTask(db *sql.DB, task *utils.Task, openid string) {
	strTask, err := QueryOpenIdToString(db, "Tasks", "UserInfo", openid)
	utils.CheckErr(err, "CreateTask:query")

	err = RewriteItemString(db, "UserInfo", "OpenId", "Tasks", strTask+task.TaskID+";", openid)
	utils.CheckErr(err, "CreateTask:append task")

	stmt, err := db.Prepare("INSERT INTO TaskToPeople(TaskID,Receiver) VALUES(?,?)")
	utils.CheckErr(err, "CreateTask:insert into TaskToPeople prepare")
	_, err = stmt.Exec(task.TaskID, openid)
	utils.CheckErr(err, "CreateTask:insert into TaskToPeople exec")

	stmt, err = db.Prepare("INSERT INTO Tasks(TaskID, Title, Pusher, Content, Status, PushDate, DeadLine, Urgency) Values(?,?,?,?,?,?,?,?)")
	utils.CheckErr(err, "CreateTask:insert into Tasks prepare")
	_, err = stmt.Exec(task.TaskID, task.Title, task.Pusher, task.Content, task.Status, task.PushDate, task.DeadLine, task.Urgency)
}

func CreateMessage(db *sql.DB, message *utils.Message) error {
	stmt, err := db.Prepare("INSERT INTO Messages(MessageID,Title,Pusher,Content,Read,NotRead,PushDate,FinalDeleteDate) VALUES(?,?,?,?,?,?,?,?)")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(message.MessageID, message.Title, message.Pusher, message.Content, message.HaveRead, message.NotRead, message.PushDate, message.FinalDeleteDate)
	if err != nil {
		return err
	}
	for _, v := range utils.ParseManage(message.NotRead) {
		var order = "UPDATE UserInfo SET Messages=Messages || '" + message.MessageID + ";' WHERE OpenId='" + v + "';"
		stmt, err = db.Prepare(order)
		if err != nil {
			return err
		}
		_, err = stmt.Exec()
		if err != nil {
			return err
		}
	}
	return nil
}

func CreateProjectRecord(pusher string, taskid string) error {
	db := ConnectPersonalDB()
	defer DisConnectDB(db)
	stmt, err := db.Prepare("INSERT INTO user_task(userID,taskID,done,notdone)VALUES(?,?,?,?)")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(pusher, taskid, 0, 0)
	if err != nil {
		return err
	}
	stmt, err = db.Prepare("UPDATE user_infor SET totalmanage=(totalmanage+1) WHERE ID=?")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(pusher)
	if err != nil {
		return err
	}
	stmt, err = db.Prepare("UPDATE user_infor SET goingon=(goingon+1) WHERE ID=?")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(pusher)
	if err != nil {
		return err
	}
	return nil
}

func CreatePrivateInfo(data *utils.WxUserInfo) error {
	db := ConnectPersonalDB()
	defer DisConnectDB(db)

	stmt, err := db.Prepare("INSERT INTO user_infor(ID,Name,Sex,Position,HeadImage) VALUES(?,?,?,?,?)")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(data.ID, data.NickName, data.Sex, data.Country+data.Province+data.City, data.HeadImage)
	if err != nil {
		return err
	}
	return nil
}
