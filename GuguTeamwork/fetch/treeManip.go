package fetch

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

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
	OpenId   string
	Title    string
	Content  string
	Deadline string
	Urgency  string
	TreeID   string
	Parent   string
}

type NewTreeData struct {
	OpenId   string
	Name     string
	Brief    string
	Deadline string
	Urgency  string
}

type DeleteNodeData struct {
	TreeID string
	TaskID string
	Parent string
}

type AlterNodeData struct {
	TreeID   string
	TaskID   string
	Title    string
	Content  string
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
		return
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
		return
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
	sort.Slice(tmp, func(i int, j int) bool {
		if strings.Compare(tmp[i], tmp[j]) < 0 {
			return true
		}
		return false
	})

	l := len(tmp) - 1
	var TreeId string
	if l >= 0 {
		x, err := strconv.Atoi(tmp[l][strings.Index(tmp[l], "_project_")+9:])
		utils.CheckErr(err, "NewProjectTree:sort to produce id")
		TreeId = ANewTreeData.OpenId + "_project_" + strconv.Itoa(x+1)
	} else {
		TreeId = ANewTreeData.OpenId + "_project_1"
	}

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
		tmp := tree.BuildMonitor()
		tmp.UpdateSig = true
		tree.GetForest().Monitors[TreeId] = tmp
	}
	tree.GetForest().MRMMutex.Unlock()
	ope := tree.BuildOpe(TreeId, TreeId, int8(1))
	tree.GetForest().ORMMutex.Lock()
	{
		tree.GetForest().Opes.Push(ope)
	}
	tree.GetForest().ORMMutex.Unlock()

	w.Write([]byte(TreeId))
}

//这个处理器负责在一颗树上新建节点
func AddNewTreeNodes(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	utils.CheckErr(err, "AddNewTreeNodes:read data")
	var ANewNodeData NewNodeData
	err = json.Unmarshal(data, &ANewNodeData)
	utils.CheckErr(err, "AddNewTreeNodes:parse data")
	r.Body.Close()

	if utils.CheckEmp(ANewNodeData.TreeID, ANewNodeData.OpenId, ANewNodeData.Title, ANewNodeData.Content, ANewNodeData.Deadline, ANewNodeData.Parent) {
		tree.SafeTreeManip(ANewNodeData.TreeID)
		log.Println("before add")
		log.Println(tree.GetForest().Projects[ANewNodeData.TreeID])
		var task = task.BuildTask(ANewNodeData.TreeID, ANewNodeData.OpenId, ANewNodeData.Title, ANewNodeData.Content, ANewNodeData.Deadline, ANewNodeData.Urgency)
		var taskNode = new(utils.TaskNode)
		taskNode.Task = *task
		err := tree.GetForest().NewTask(ANewNodeData.TreeID, ANewNodeData.Parent, taskNode)
		//要添加的parent并不存在
		if err != nil {
			w.WriteHeader(300)
			return
		}
		log.Println("after add")
		log.Println(tree.GetForest().Projects[ANewNodeData.TreeID])
	} else {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		return
	}
}

//这个处理器移除树上的一个结点，如果移除的是非子节点，所有它的子节点将被移除
func DropFromTree(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	utils.CheckErr(err, "DropFromTree:read data")
	var ADeleteNodeData DeleteNodeData
	err = json.Unmarshal(data, &ADeleteNodeData)
	utils.CheckErr(err, "DropFromTree:parse data")
	r.Body.Close()

	tree.SafeTreeManip(ADeleteNodeData.TreeID)
	tree.GetForest().PRMMutex.RLock()
	tmp := make([]utils.TaskNode, len(tree.GetForest().Projects[ADeleteNodeData.TreeID]))
	copy(tmp, tree.GetForest().Projects[ADeleteNodeData.TreeID])
	tree.GetForest().PRMMutex.RUnlock()

	log.Println("tree before delete")
	log.Println(tmp)

	var flag = -1
	for k, v := range tmp {
		if v.Task.TaskID == ADeleteNodeData.TaskID {
			flag = k
			break
		}
	}
	//想删除的节点并不存在
	if flag == -1 {
		w.WriteHeader(300)
		return
	}

	if ADeleteNodeData.Parent != "" {
		for k, _ := range tmp {
			if tmp[k].Task.TaskID == ADeleteNodeData.Parent {
				for i, j := range tmp[k].Child {
					if j == flag {
						tmp[k].Child = append(tmp[k].Child[:i], tmp[k].Child[i+1:]...)
					}
				}
			}
		}
	}

	var apra = make([]bool, len(tmp))
	var apra2 = make([]int, len(tmp))
	for k, _ := range tmp {
		apra2[k] = tmp[k].Self
	}

	tree.MarkNode(tmp, flag, apra)
	apra[flag] = true

	for k, v := range apra {
		if v {
			ope := tree.BuildDeleteOpe(ADeleteNodeData.TreeID, tmp[k].Task.TaskID, int8(-1), tmp[k].TeamMates)
			tree.GetForest().ORMMutex.Lock()
			{
				tree.GetForest().Opes.Push(ope)
			}
			tree.GetForest().ORMMutex.Unlock()
		}
	}

	var count = 0
	for k, v := range apra {
		if v {
			for i := k + 1; i < len(tmp); i++ {
				tmp[i].Self--
				apra2[i]--
			}
			tmp = append(tmp[:k-count], tmp[k-count+1:]...)
			count++
		}
	}

	for k, _ := range tmp {
		for i, _ := range tmp[k].Child {
			tmp[k].Child[i] = apra2[tmp[k].Child[i]]
		}
	}

	log.Println("after delete")
	log.Println(tmp)

	tree.GetForest().PRMMutex.Lock()
	{
		tree.GetForest().Projects[ADeleteNodeData.TreeID] = tmp
	}
	tree.GetForest().PRMMutex.Unlock()
	tree.GetForest().MRMMutex.Lock()
	{
		tmp := tree.GetForest().Monitors[ADeleteNodeData.TreeID]
		tmp.UpdateSig = true
		tree.GetForest().Monitors[ADeleteNodeData.TreeID] = tmp
	}
	tree.GetForest().MRMMutex.Unlock()
}

//这个处理器修改一个task的内部内容
func AlterNode(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	utils.CheckErr(err, "AlterNode:read data")
	var AAlterNodeData AlterNodeData
	err = json.Unmarshal(data, &AAlterNodeData)
	utils.CheckErr(err, "AlterNode:parse data")
	r.Body.Close()

	if utils.CheckEmp(AAlterNodeData.TreeID, AAlterNodeData.TaskID, AAlterNodeData.Title, AAlterNodeData.Content, AAlterNodeData.Deadline) {
		tree.SafeTreeManip(AAlterNodeData.TreeID)
		log.Println("before alter")
		log.Println(tree.GetForest().Projects[AAlterNodeData.TreeID])
		var replica utils.TaskNode
		var flag = -1
		tree.GetForest().PRMMutex.RLock()
		{
			for k, v := range tree.GetForest().Projects[AAlterNodeData.TreeID] {
				if v.Task.TaskID == AAlterNodeData.TaskID {
					replica.Child = v.Child
					replica.Self = v.Self
					replica.TeamMates = v.TeamMates
					replica.Task = v.Task
					flag = k
					break
				}
			}
		}
		tree.GetForest().PRMMutex.RUnlock()
		if flag == -1 {
			w.WriteHeader(300)
			return
		}
		replica.Task.Title = AAlterNodeData.Title
		replica.Task.Content = AAlterNodeData.Content
		t, err := time.Parse("2006-01-02T15:04:05Z", AAlterNodeData.Deadline)
		replica.Task.DeadLine = t
		utils.CheckErr(err, "AlterNode:time parse")
		if AAlterNodeData.Urgency != "" {
			tempInt, err := strconv.Atoi(AAlterNodeData.Urgency)
			utils.CheckErr(err, "AlterNode:parse urgency")
			replica.Task.Urgency = int8(tempInt)
		}
		tree.GetForest().PRMMutex.Lock()
		{
			tree.GetForest().Projects[AAlterNodeData.TreeID][flag] = replica
		}
		tree.GetForest().PRMMutex.Unlock()
		tree.GetForest().MRMMutex.Lock()
		{
			tmp := tree.GetForest().Monitors[AAlterNodeData.TreeID]
			tmp.UpdateSig = true
			tree.GetForest().Monitors[AAlterNodeData.TreeID] = tmp
		}
		tree.GetForest().MRMMutex.Unlock()
		ope := tree.BuildOpe(AAlterNodeData.TreeID, AAlterNodeData.TaskID, int8(0))
		tree.GetForest().ORMMutex.Lock()
		{
			tree.GetForest().Opes.Push(ope)
		}
		tree.GetForest().ORMMutex.Unlock()
		log.Println("after alter")
		log.Println(tree.GetForest().Projects[AAlterNodeData.TreeID])
	} else {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		return
	}
}
