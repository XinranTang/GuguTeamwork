package tree

import (
	"GuguTeamwork/utils"
)

var forest *Forest

type Forest struct {
	projects map[string][]utils.TaskNode
}

func BuildForest() {
	forest = new(Forest)
}

func GetForest() *Forest {
	return forest
}

func (f *Forest) InitForest() {
	f.projects = make(map[string][]utils.TaskNode)
	readForest(f)
}

func (f *Forest) GetProjects() map[string][]utils.TaskNode {
	return f.projects
}

//添加新任务需要知道新任务所属的项目ID，所属的父任务ID，以及任务的相关信息
func (f *Forest) NewTask(Project string, parent string, TaskNode *utils.TaskNode) {
	TaskNode.Self = len(f.projects[Project])
	TaskNode.Child = []int{0}
	for _, v := range f.projects[Project] {
		if v.Task.TaskID == parent {
			v.Child = append(v.Child, TaskNode.Self)
			f.projects[Project] = append(f.projects[Project], *TaskNode)
		}
	}
}
