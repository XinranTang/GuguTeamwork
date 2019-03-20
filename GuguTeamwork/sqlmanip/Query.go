package sqlmanip

import (
	"database/sql"
	"time"

	"GuguTeamwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func QueryUserInfo(db *sql.DB, openid string) (*utils.UserInfo, error) {
	var AUserInfo utils.UserInfo
	var Astring, Bstring string

	//填充登陆时间信息
	var order = "SELECT OpenId,LastTimeAccess,SuccessiveAccessDays,Level,Manage FROM UserInfo WHERE OpenId LIKE '" + openid + "';"
	err := db.QueryRow(order).Scan(&AUserInfo.OpenId, &Astring, &AUserInfo.SuccessiveAccessDays, &AUserInfo.Level, &AUserInfo.Manage)
	utils.CheckErr(err)
	AUserInfo.LastTimeAccess, err = time.Parse("2006-01-02T15:04:05Z", Astring)
	utils.CheckErr(err)

	//填充消息和任务信息
	var AMessage utils.Message
	order = "SELECT Title,Pusher,Content,Status,PushDate,FinalDeleteDate FROM " + utils.DealWithOpenId(openid) + "_message;"
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
	order = "SELECT Title,Pusher,Content,Status,PushDate,DeadLine,Urgency FROM " + utils.DealWithOpenId(openid) + "_task;"
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

func QueryStringToString(db *sql.DB, header string, table string, openid string) string {
	var order = "SELECT " + header + " FROM " + table + " WHERE OpenId=" + "'" + openid + "';"
	var tempStr string
	err := db.QueryRow(order).Scan(&tempStr)
	utils.CheckErr(err)
	return tempStr
}

func QueryTrees(db *sql.DB) []string {
	rows, err := db.Query("SELECT * FROM Tree;")
	utils.CheckErr(err)
	var trees []string
	var tempStr string
	for rows.Next() {
		err = rows.Scan(&tempStr)
		utils.CheckErr(err)
		trees = append(trees, tempStr)
	}
	return trees
}

func QueryTaskNode(db *sql.DB, treeName string) []utils.TaskNodeInDB {
	var order = "SELECT * FROM " + treeName + ";"
	rows, err := db.Query(order)
	utils.CheckErr(err)
	var nodes []utils.TaskNodeInDB
	var node utils.TaskNodeInDB
	for rows.Next() {
		err = rows.Scan(&node.TaskID, &node.Self, &node.Child)
		utils.CheckErr(err)
		nodes = append(nodes, node)
	}
	return nodes
}

func QueryTaskFromID(db *sql.DB, TaskID string) *utils.Task {
	var order = "SELECT * FROM Tasks WHERE TaskID=" + "'" + TaskID + "';"
	rows, err := db.Query(order)
	utils.CheckErr(err)
	var ATask utils.Task
	var tempStrA, tempStrB string
	for rows.Next() {
		err = rows.Scan(&ATask.TaskID, &ATask.Title, &ATask.Pusher, &ATask.Content, &ATask.Status, &tempStrA, &tempStrB, &ATask.Urgency)
		utils.CheckErr(err)
		ATask.PushDate, err = time.Parse("2006-01-02T15:04:05Z", tempStrA)
		utils.CheckErr(err)
		ATask.DeadLine, err = time.Parse("2006-01-02T15:04:05Z", tempStrB)
		utils.CheckErr(err)
	}
	return &ATask
}
