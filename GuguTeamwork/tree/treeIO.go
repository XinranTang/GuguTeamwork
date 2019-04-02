package tree

import (
	"sort"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

func readForest(f *Forest) {
	db := sqlmanip.ConnectTaskDB()
	defer sqlmanip.DisConnectDB(db)

	trees := sqlmanip.QueryTrees(db)

	var nodes []utils.TaskNodeInDB
	for _, v := range trees {
		nodes = sqlmanip.QueryTaskNode(db, v)
		f.projects[v] = buildTree(nodes)
	}
}

func buildTree(TaskInDBList []utils.TaskNodeInDB) []utils.TaskNode {
	db := sqlmanip.ConnetUserDB()
	defer sqlmanip.DisConnectDB(db)

	var tree = make([]utils.TaskNode, 0)
	var ATaskNode *utils.TaskNode
	for _, v := range TaskInDBList {
		ATaskNode = new(utils.TaskNode)
		ATaskNode.Task = *sqlmanip.QueryTaskFromID(db, v.TaskID)
		ATaskNode.Child = utils.ParseTaskNodeInDBChild(v.Child)
		ATaskNode.Self = v.Self
		tree = append(tree, *ATaskNode)
	}

	sort.Slice(tree, func(i int, j int) bool {
		return tree[i].Self < tree[j].Self
	})

	return tree
}

//添加新任务需要知道新任务所属的项目ID，所属的父任务ID，以及任务的相关信息
func (f *Forest) NewTask(Project string, parent string, TaskNode *utils.TaskNode) {
	TaskNode.Self = len(f.projects[Project])
	TaskNode.Child = []int{0}
	for i := 0; i < len(f.projects[Project]); i++ {
		if f.projects[Project][i].Task.TaskID == parent {
			if f.projects[Project][i].Child[0] == 0 {
				f.projects[Project][i].Child[0] = TaskNode.Self
			} else {
				f.projects[Project][i].Child = append(f.projects[Project][i].Child, TaskNode.Self)
			}
			f.projects[Project] = append(f.projects[Project], *TaskNode)
		}
	}
}
