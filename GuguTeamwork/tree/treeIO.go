package tree

import (
	"sort"
	"strconv"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

func SafeTreeManip(treeId string) {
	var ok bool
	forest.PRMMutex.Lock()
	{
		if _, ok = forest.Projects[treeId]; ok {
		}
	}
	forest.PRMMutex.Unlock()
	if !ok {
		db := sqlmanip.ConnectTaskDB()
		nodes := sqlmanip.QueryTaskNode(db, treeId)
		sqlmanip.DisConnectDB(db)
		tmp := buildTree(nodes)
		forest.PRMMutex.Lock()
		{
			forest.Projects[treeId] = tmp
		}
		forest.PRMMutex.Unlock()
		forest.MRMMutex.Lock()
		{
			forest.Monitors[treeId] = BuildMonitor()
		}
		forest.MRMMutex.Unlock()
	}
	forest.MRMMutex.Lock()
	{
		if len(forest.Monitors[treeId].Timer.C) > 0 {
			<-forest.Monitors[treeId].Timer.C
		}
		forest.Monitors[treeId].Timer.Reset(forestFlushDuration)
	}
	forest.MRMMutex.Unlock()
}

func buildTree(TaskInDBList []utils.TaskNodeInDB) []utils.TaskNode {
	db := sqlmanip.ConnetUserDB()
	defer sqlmanip.DisConnectDB(db)

	var tree = make([]utils.TaskNode, 0)
	var ATaskNode *utils.TaskNode
	var err error
	for _, v := range TaskInDBList {
		ATaskNode = new(utils.TaskNode)
		ATaskNode.Task, err = sqlmanip.QueryTaskFromID(db, v.TaskID)
		utils.CheckErr(err, "buildTree:query task")
		ATaskNode.Child = utils.ParseTaskNodeInDBChild(v.Child)
		ATaskNode.Self = v.Self
		res, err := sqlmanip.QueryTaskIDToString(db, "Receiver", "TaskToPeople", v.TaskID)
		utils.CheckErr(err, "buildTree:query receiver")
		ATaskNode.TeamMates = utils.ParseManage(res)
		tree = append(tree, *ATaskNode)
	}

	sort.Slice(tree, func(i int, j int) bool {
		return tree[i].Self < tree[j].Self
	})

	return tree
}

//添加新任务需要知道新任务所属的项目ID，所属的父任务ID，以及任务的相关信息
func (f *Forest) NewTask(Project string, parent string, TaskNode *utils.TaskNode) error {
	TaskNode.Child = []int{0}
	var i int
	var j = len(TaskNode.Task.TaskID)
	for i = j - 1; TaskNode.Task.TaskID[i] != '-'; i-- {
	}
	size, err := strconv.Atoi(TaskNode.Task.TaskID[i+1 : j])
	utils.CheckErr(err, "NewTask:get size")
	TaskNode.Self = size

	var flag = true
	forest.PRMMutex.Lock()
	{
		for i := 0; i < len(forest.Projects[Project]); i++ {
			if forest.Projects[Project][i].Task.TaskID == parent {
				if forest.Projects[Project][i].Child[0] == 0 {
					forest.Projects[Project][i].Child[0] = TaskNode.Self
				} else {
					forest.Projects[Project][i].Child = append(forest.Projects[Project][i].Child, TaskNode.Self)
				}
				forest.Projects[Project] = append(forest.Projects[Project], *TaskNode)
				flag = false
				break
			}
		}
	}
	forest.PRMMutex.Unlock()

	if flag {
		return new(utils.TreeManipError)
	}

	forest.MRMMutex.Lock()
	{
		tmp := forest.Monitors[Project]
		tmp.UpdateSig = true
		forest.Monitors[Project] = tmp
	}
	forest.MRMMutex.Unlock()

	ope := BuildOpe(Project, TaskNode.Task.TaskID, int8(1))
	forest.ORMMutex.Lock()
	{
		forest.Opes.Push(ope)
	}
	forest.ORMMutex.Unlock()

	return nil
}

func MarkNode(base []utils.TaskNode, index int, apra []bool) {
	for _, v := range base[index].Child {
		if v == 0 {
			apra[index] = true
		} else {
			MarkNode(base, v, apra)
			apra[index] = true
		}
	}
}
