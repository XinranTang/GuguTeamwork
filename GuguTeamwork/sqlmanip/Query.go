package sqlmanip

import (
	"database/sql"

	"GuguTeamwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func QueryUserInfo(db *sql.DB, openid string) *utils.UserInfo {
	var AUserInfo utils.UserInfo
	var strMessages, strTasks string

	//填充登陆时间信息
	var order = "SELECT * FROM UserInfo WHERE OpenId='" + openid + "';"
	err := db.QueryRow(order).Scan(
		&AUserInfo.OpenId,
		&AUserInfo.LastTimeAccess,
		&AUserInfo.SuccessiveAccessDays,
		&AUserInfo.Level,
		&AUserInfo.Manage,
		&strMessages,
		&strTasks)
	utils.CheckErr(err, "QueryUserInfo:query user")

	//填充消息和任务信息
	var AMessage utils.Message
	var messages = utils.ParseManage(strMessages)
	for _, v := range messages {
		order = "SELECT * FROM Messages WHERE MessageID='" + v + "';"
		err = db.QueryRow(order).Scan(&AMessage.MessageID,
			&AMessage.Title,
			&AMessage.Pusher,
			&AMessage.Content,
			&AMessage.Status,
			&AMessage.PushDate,
			&AMessage.FinalDeleteDate)
		utils.CheckErr(err, "QueryUserInfo:query message")
		AUserInfo.Messages = append(AUserInfo.Messages, AMessage)
	}

	var ATask utils.Task
	var tasks = utils.ParseManage(strTasks)
	for _, v := range tasks {
		order = "SELECT * FROM Tasks WHERE TaskID='" + v + "';"
		err = db.QueryRow(order).Scan(&ATask.TaskID,
			&ATask.Title,
			&ATask.Pusher,
			&ATask.Content,
			&ATask.Status,
			&ATask.PushDate,
			&ATask.DeadLine,
			&ATask.Urgency)
		utils.CheckErr(err, "QueryUserInfo:query task")
		AUserInfo.Tasks = append(AUserInfo.Tasks, ATask)
	}
	return &AUserInfo
}

func QueryPrivateInfo(db *sql.DB, openid string) *utils.PrivateInfo {
	var AInfo utils.PrivateInfo

	var order = "SELECT * FROM user_infor WHERE ID='" + openid + "';"
	err := db.QueryRow(order).Scan(
		&AInfo.ID,
		&AInfo.Name,
		&AInfo.Sign,
		&AInfo.Sex,
		&AInfo.Phone,
		&AInfo.Mail,
		&AInfo.Position,
		&AInfo.Ability)
	utils.CheckErr(err, "QueryPrivateInfo:query")
	return &AInfo
}

func QueryOpenIdToString(db *sql.DB, header string, table string, openid string) (string, error) {
	var order = "SELECT " + header + " FROM " + table + " WHERE OpenId='" + openid + "';"
	var tempStr string
	err := db.QueryRow(order).Scan(&tempStr)
	if err != nil {
		return "", err
	}
	return tempStr, nil
}

func QueryTaskIDToString(db *sql.DB, header string, table string, taskid string) (string, error) {
	var order = "SELECT " + header + " FROM " + table + " WHERE TaskID='" + taskid + "';"
	var tempStr string
	err := db.QueryRow(order).Scan(&tempStr)
	if err != nil {
		return "", err
	}
	return tempStr, nil
}

func QueryTrees(db *sql.DB) []string {
	rows, err := db.Query("SELECT TreeID FROM ProjectTrees;")
	utils.CheckErr(err, "QueryTrees:query")
	var trees []string
	var tempStr string
	for rows.Next() {
		err = rows.Scan(&tempStr)
		utils.CheckErr(err, "QueryTrees:scan")
		trees = append(trees, tempStr)
	}
	return trees
}

func QueryTaskNode(db *sql.DB, treeName string) []utils.TaskNodeInDB {
	var order = "SELECT * FROM " + treeName + ";"
	rows, err := db.Query(order)
	utils.CheckErr(err, "QueryTaskNode:query")
	var nodes []utils.TaskNodeInDB
	var node utils.TaskNodeInDB
	for rows.Next() {
		err = rows.Scan(&node.TaskID, &node.Self, &node.Child)
		utils.CheckErr(err, "QueryTaskNode:scan")
		nodes = append(nodes, node)
	}
	return nodes
}

func QueryTaskFromID(db *sql.DB, TaskID string) (utils.Task, error) {
	var order = "SELECT * FROM Tasks WHERE TaskID='" + TaskID + "';"
	rows, err := db.Query(order)
	var emp = utils.Task{}
	if err != nil {
		return emp, err
	}
	var ATask utils.Task
	for rows.Next() {
		err = rows.Scan(&ATask.TaskID, &ATask.Title, &ATask.Pusher, &ATask.Content, &ATask.Status, &ATask.PushDate, &ATask.DeadLine, &ATask.Urgency)
		if err != nil {
			return emp, err
		}
	}
	return ATask, nil
}

func QueryTreeName(db *sql.DB, TreeID string) (string, error) {
	var res string
	err := db.QueryRow("SELECT ProjectName From ProjectTrees WHERE TreeID=?", TreeID).Scan(&res)
	if err != nil {
		return "", err
	}
	return res, nil
}
