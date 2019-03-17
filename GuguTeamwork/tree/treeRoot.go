package tree

import (
	"GuguTeamwork/utils"
)

type Forest struct {
	projects map[string]*utils.TaskNode
}

func (f *Forest) InitForest() {
	f.projects = make(map[string]*utils.TaskNode)
	readForest(f)
}
