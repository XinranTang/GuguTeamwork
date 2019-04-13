package task

import (
	"strconv"
	"time"

	"GuguTeamwork/tree"
	"GuguTeamwork/utils"
)

func BuildTask(TreeId string, OpenId string, Title string, Content string, Deadline string, Urgency string) *utils.Task {
	var task utils.Task
	var err error
	var size int
	tree.GetForest().PRMMutex.RLock()
	{
		if v, ok := tree.GetForest().Projects[TreeId]; ok {
			size = len(v)
		} else {
			size = 0
		}
	}
	tree.GetForest().PRMMutex.RUnlock()
	if size == 0 {
		task.TaskID = TreeId
	} else {
		task.TaskID = TreeId + "-task-" + strconv.Itoa(size)
	}
	task.Title = Title
	task.Pusher = OpenId
	task.Content = Content
	task.Status = -1
	task.PushDate = time.Now().UTC()
	task.DeadLine, err = time.Parse("2006-01-02T15:04:05Z", Deadline)
	utils.CheckErr(err, "BuildTask:time parsing")
	if Urgency != "" {
		tempInt, err := strconv.Atoi(Urgency)
		task.Urgency = int8(tempInt)
		utils.CheckErr(err, "BuildTask: strconv")
	} else {
		task.Urgency = 0
	}

	//将新任务的信息同时写入数据库
	//db := sqlmanip.ConnetUserDB()
	//sqlmanip.CreateTask(db, &task, OpenId)
	//sqlmanip.DisConnectDB(db)

	return &task
}
