package fetch

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"strings"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/task"
	"GuguTeamwork/tree"
	"GuguTeamwork/utils"
)

type ProjectTree struct {
	Tree     []utils.TaskNode
	TreeName string
	TreeId   string
}

type NewNodeData struct {
	OpenId    string
	Title     string
	Content   string
	Deadline  string
	Urgency   string
	TreeID    string
	Parent    string
	TeamMates []string
}

type NewTreeData struct {
	OpenId   string
	Name     string
	Brief    string
	Deadline string
	Urgency  string
}

//这个处理器返回一个用户所管理的所有项目的项目树
func GetTrees(w http.ResponseWriter, r *http.Request) {
	db := sqlmanip.ConnetUserDB()
	var trees []ProjectTree
	var projectTree ProjectTree
	if !utils.CheckEmp(r.PostFormValue("OpenId")) {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		utils.CheckErr(err, "Trees:empty para")
	}
	tempStr, err := sqlmanip.QueryOpenIdToString(db, "Manage", "UserInfo", r.PostFormValue("OpenId"))
	utils.CheckErr(err, "Trees:query")
	sqlmanip.DisConnectDB(db)

	db = sqlmanip.ConnectTaskDB()
	for _, v := range utils.ParseManage(tempStr) {
		projectTree.TreeId = v
		tree.SafeTreeManip(v)
		tree.GetForest().PRMMutex.RLock()
		{
			projectTree.Tree = tree.GetForest().Projects[v]
		}
		tree.GetForest().PRMMutex.RUnlock()
		projectTree.TreeName, err = sqlmanip.QueryTreeName(db, v)
		utils.CheckErr(err, "Trees:query project name")
		trees = append(trees, projectTree)
	}
	sqlmanip.DisConnectDB(db)

	output, err := json.MarshalIndent(trees, "", "\t\t")
	utils.CheckErr(err, "Trees:form json")
	//output, err = utils.Utf8ToGbk(output)
	//utils.CheckErr(err, "Trees:utf8tojson")

	w.Header().Set("Content-type", "application/json")
	w.Write(output)
}

//建立一棵新的任务树
func NewProjectTree(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	utils.CheckErr(err, "NewProjectTree:read data")
	var ANewTreeData NewTreeData
	err = json.Unmarshal(data, &ANewTreeData)
	utils.CheckErr(err, "NewProjectTree:parse data")
	r.Body.Close()

	if !utils.CheckEmp(ANewTreeData.OpenId, ANewTreeData.Name, ANewTreeData.Brief, ANewTreeData.Deadline) {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		utils.CheckErr(err, "NewProjectTree:get data")
	}

	db := sqlmanip.ConnetUserDB()
	manage, err := sqlmanip.QueryOpenIdToString(db, "Manage", "UserInfo", ANewTreeData.OpenId)
	utils.CheckErr(err, "NewProjectTree:query manage")
	sqlmanip.DisConnectDB(db)

	var tmp []string
	tree.GetForest().PRMMutex.RLock()
	{
		for k, _ := range tree.GetForest().Projects {
			strings.Contains(k, ANewTreeData.OpenId)
			tmp = append(tmp, k)
		}
	}
	tree.GetForest().PRMMutex.RUnlock()

	tmp = append(tmp, utils.ParseManage(manage)...)
	tmp = utils.QuickMerge(tmp)
	var TreeId = ANewTreeData.OpenId + "_project_" + strconv.Itoa(len(tmp)+1)

	var firstNode utils.TaskNode
	firstNode.Task = *task.BuildTask(TreeId, ANewTreeData.OpenId, ANewTreeData.Name, ANewTreeData.Brief, ANewTreeData.Deadline, ANewTreeData.Urgency)
	firstNode.Self = 0
	firstNode.Child = append(firstNode.Child, 0)
	firstNode.TeamMates = append(firstNode.TeamMates, ANewTreeData.OpenId)
	newTree := make([]utils.TaskNode, 0)
	newTree = append(newTree, firstNode)
	tree.GetForest().PRMMutex.Lock()
	{
		tree.GetForest().Projects[TreeId] = newTree
	}
	tree.GetForest().PRMMutex.Unlock()
	tree.GetForest().MRMMutex.Lock()
	{
		tree.GetForest().Monitors[TreeId] = tree.BuildMonitor()
	}
	tree.GetForest().MRMMutex.Unlock()
}

//这个处理器负责在一颗树上新建节点
func AddNewTreeNodes(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	utils.CheckErr(err, "AddNewTreeNodes:read data")
	var ANewNodeData NewNodeData
	err = json.Unmarshal(data, &ANewNodeData)
	utils.CheckErr(err, "AddNewTreeNodes:parse data")
	r.Body.Close()

	if utils.CheckEmp(ANewNodeData.OpenId, ANewNodeData.Title, ANewNodeData.Content, ANewNodeData.Deadline) {
		log.Println("before suspend")
		log.Println(tree.GetForest().Projects)
		tree.SafeTreeManip(ANewNodeData.TreeID)
		log.Println("after suspend")
		log.Println(tree.GetForest().Projects)
		var task = task.BuildTask(ANewNodeData.TreeID, ANewNodeData.OpenId, ANewNodeData.Title, ANewNodeData.Content, ANewNodeData.Deadline, ANewNodeData.Urgency)
		var taskNode = new(utils.TaskNode)
		taskNode.Task = *task
		taskNode.TeamMates = ANewNodeData.TeamMates
		log.Println(*taskNode)
		log.Println("build complete")
		tree.GetForest().NewTask(ANewNodeData.TreeID, ANewNodeData.Parent, taskNode)
	} else {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		utils.CheckErr(err, "AddNewTreeNodes:empty para")
	}
}
