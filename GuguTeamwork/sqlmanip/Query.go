package sqlmanip

import (
	"database/sql"
	"log"
	"time"

	"GuguTeamwork/utils"
)

func QueryUserInfo(db *sql.DB, openid string) *utils.UserInfo {
	var AUserInfo utils.UserInfo
	var strMessages, strTasks, tmpStr, tmpStr2 string

	//填充登陆时间信息
	log.Println(openid)
	var order = "SELECT * FROM UserInfo WHERE OpenId='" + openid + "';"
	err := db.QueryRow(order).Scan(
		&AUserInfo.OpenId,
		&tmpStr,
		&AUserInfo.SuccessiveAccessDays,
		&AUserInfo.Level,
		&AUserInfo.Manage,
		&strMessages,
		&strTasks)
	utils.CheckErr(err, "QueryUserInfo:query user")
	AUserInfo.LastTimeAccess, err = time.Parse("2006-01-02 15:04:05", tmpStr)
	utils.CheckErr(err, "QueryUserInfo:parse time")

	//填充消息和任务信息
	var AMessage utils.Message
	var messages = utils.ParseManage(strMessages)
	for _, v := range messages {
		order = "SELECT * FROM Messages WHERE MessageID='" + v + "';"
		err = db.QueryRow(order).Scan(&AMessage.MessageID,
			&AMessage.Title,
			&AMessage.Pusher,
			&AMessage.Content,
			&AMessage.HaveRead,
			&AMessage.NotRead,
			&tmpStr,
			&tmpStr2)
		utils.CheckErr(err, "QueryUserInfo:query message")
		AMessage.PushDate, err = time.Parse("2006-01-02 15:04:05", tmpStr)
		utils.CheckErr(err, "QueryUserInfo:parse time")
		AMessage.FinalDeleteDate, err = time.Parse("2006-01-02 15:04:05", tmpStr2)
		utils.CheckErr(err, "QueryUserInfo:parse time")
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
			&tmpStr,
			&tmpStr2,
			&ATask.Urgency)
		utils.CheckErr(err, "QueryUserInfo:query task")
		ATask.PushDate, err = time.Parse("2006-01-02 15:04:05", tmpStr)
		utils.CheckErr(err, "QueryUserInfo:parse time")
		ATask.DeadLine, err = time.Parse("2006-01-02 15:04:05", tmpStr2)
		utils.CheckErr(err, "QueryUserInfo:parse time")
		AUserInfo.Tasks = append(AUserInfo.Tasks, ATask)
	}
	return &AUserInfo
}

func QueryPrivateInfo(db *sql.DB, openid string) (*utils.PrivateInfo, error) {
	var AInfo utils.PrivateInfo
	var order = "SELECT ID,Name,Sign,Sex,Phone,Mail,Position,Ability FROM user_infor WHERE ID='" + openid + "';"
	err := db.QueryRow(order).Scan(
		&AInfo.ID,
		&AInfo.Name,
		&AInfo.Sign,
		&AInfo.Sex,
		&AInfo.Phone,
		&AInfo.Mail,
		&AInfo.Position,
		&AInfo.Ability)
	if err != nil {
		return nil, err
	}
	return &AInfo, nil
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

func QueryMessageIDToString(db *sql.DB, header string, table string, messageid string) (string, error) {
	var order = "SELECT " + header + " FROM " + table + " WHERE MessageID='" + messageid + "';"
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
	var tmpStrA, tmpStrB string
	rows, err := db.Query(order)
	var emp = utils.Task{}
	if err != nil {
		return emp, err
	}
	var ATask utils.Task
	for rows.Next() {
		err = rows.Scan(&ATask.TaskID, &ATask.Title, &ATask.Pusher, &ATask.Content, &ATask.Status, &tmpStrA, &tmpStrB, &ATask.Urgency)
		if err != nil {
			return emp, err
		}
		ATask.PushDate, err = time.Parse("2006-01-02 15:04:05", tmpStrA)
		utils.CheckErr(err, "QueryTaskFromID:parse time")
		ATask.DeadLine, err = time.Parse("2006-01-02 15:04:05", tmpStrB)
		utils.CheckErr(err, "QueryTaskFromID:parse time")
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

func CountMessage(db *sql.DB, pusher string) (int, error) {
	rows, err := db.Query("SELECT * From Messages WHERE Pusher=?", pusher)
	if err != nil {
		return -1, err
	}
	var count = 0
	for rows.Next() {
		count++
	}
	return count, nil
}
