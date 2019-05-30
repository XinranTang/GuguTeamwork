package task

import (
	"strconv"
	"strings"
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
		//如果该项目已经存在了
		if v, ok := tree.GetForest().Projects[TreeId]; ok {
			l := len(v) - 1
			if l >= 1 {
				x, err := strconv.Atoi(v[l].Task.TaskID[strings.Index(v[l].Task.TaskID, "-task-")+6:])
				utils.CheckErr(err, "BuildTask:build task id")
				size = x + 1
			} else {
				size = 1
			}
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
	task.PushDate = time.Now()
	task.DeadLine, err = time.Parse("2006-01-02 15:04:05", Deadline)
	utils.CheckErr(err, "BuildTask:time parsing")
	if Urgency != "" {
		tempInt, err := strconv.Atoi(Urgency)
		task.Urgency = int8(tempInt)
		utils.CheckErr(err, "BuildTask: strconv")
	} else {
		task.Urgency = 0
	}

	return &task
}
