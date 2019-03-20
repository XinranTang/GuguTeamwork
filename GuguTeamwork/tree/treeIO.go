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

	var tree []utils.TaskNode
	var ATaskNode utils.TaskNode
	for _, v := range TaskInDBList {
		ATaskNode.Task = *sqlmanip.QueryTaskFromID(db, v.TaskID)
		ATaskNode.Child = utils.ParseTaskNodeInDBChild(v.Child)
		ATaskNode.Self = v.Self
		tree = append(tree, ATaskNode)
	}

	sort.Slice(tree, func(i int, j int) bool {
		return tree[i].Self < tree[j].Self
	})

	return tree
}
