package task

import (
	"strconv"
	"time"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

func BuildTask(OpenId string, Title string, Pusher string, Content string, Deadline string, Urgency string) *utils.Task {
	var task utils.Task
	var err error
	task.TaskID = taskIDProducer(OpenId)
	task.Title = Title
	task.Pusher = Pusher
	task.Content = Content
	task.Status = false
	task.PushDate = time.Now()
	task.DeadLine, err = time.Parse("2006-01-02T15:04:05Z", Deadline)
	utils.CheckErr(err, "BuildTask:time parsing")
	if Urgency != "" {
		tempInt, err := strconv.Atoi(Urgency)
		task.Urgency = int8(tempInt)
		utils.CheckErr(err, "BuildTask: strconv")
	} else {
		Urgency = 0
	}

	//将新任务的信息同时写入数据库
	db := sqlmanip.ConnetUserDB()
	sqlmanip.CreateTask(db, &task, OpenId)
	sqlmanip.DisConnectDB(db)

	return &task
}

func taskIDProducer(openid string) string {
	db := sqlmanip.ConnetUserDB()
	defer sqlmanip.DisConnectDB(db)
	res, err := sqlmanip.QueryStringToString(db, Tasks, UserInfo, openid)
	utils.CheckErr(err, "taskIDProducer:query")
	var count int
	for i := 0; i < len(res); i++ {
		if res[i] == ';' {
			count++
		}
	}
	return openid + "-task-" + strconv.Itoa(count+1)
}
