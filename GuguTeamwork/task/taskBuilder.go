package task

import (
	"strconv"
	"time"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

func BuildTask(Title string, Pusher string, Content string, Deadline string, Urgency string) *utils.Task {
	var task utils.Task
	var err error
	task.TaskID = "testtaskid3"
	task.Title = Title
	task.Pusher = Pusher
	task.Content = Content
	task.Status = false
	task.PushDate = time.Now()
	task.DeadLine, err = time.Parse("2006-01-02T15:04:05Z", Deadline)
	utils.CheckErr(err)
	if Urgency != "" {
		tempInt, err := strconv.Atoi(Urgency)
		task.Urgency = int8(tempInt)
		utils.CheckErr(err)
	}

	db := sqlmanip.ConnetUserDB()

	sqlmanip.DisConnectDB(db)

	return &task
}

func BuildTaskId()
