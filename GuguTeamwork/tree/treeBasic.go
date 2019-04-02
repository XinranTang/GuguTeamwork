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
