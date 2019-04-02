package fetch

import (
	"encoding/json"
	"net/http"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/task"
	"GuguTeamwork/tree"
	"GuguTeamwork/utils"
)

type TreeWithId struct {
	Tree   []utils.TaskNode
	TreeId string
}

//这个处理器返回一个用户所管理的所有项目的项目树
func Trees(w http.ResponseWriter, r *http.Request) {
	db := sqlmanip.ConnetUserDB()
	defer sqlmanip.DisConnectDB(db)
	var trees []TreeWithId
	var treeWithId TreeWithId
	if !utils.CheckEmp(r.PostFormValue("OpenId")) {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		utils.CheckErr(err, "Trees:empty para")
	}
	tempStr, err := sqlmanip.QueryStringToString(db, "Manage", "UserInfo", r.PostFormValue("OpenId"))
	utils.CheckErr(err, "Trees:query")
	for _, v := range utils.ParseManage(tempStr) {
		treeWithId.TreeId = v
		treeWithId.Tree = tree.GetForest().GetProjects()[v]
		trees = append(trees, treeWithId)
	}

	output, err := json.MarshalIndent(trees, "", "\t\t")
	utils.CheckErr(err, "Trees:form json")
	//output, err = utils.Utf8ToGbk(output)
	//utils.CheckErr(err, "Trees:utf8tojson")

	w.Header().Set("Content-type", "application/json")
	w.Write(output)
}

//这个处理器负责在一颗树上新建节点
func AddNewTreeNodes(w http.ResponseWriter, r *http.Request) {
	if utils.CheckEmp(r.PostFormValue("OpenId"), r.PostFormValue("Title"), r.PostFormValue("Pusher"), r.PostFormValue("Content"), r.PostFormValue("Deadline"), r.PostFormValue("Urgency"), r.PostFormValue("TreeId"), r.PostFormValue("Parent")) {
		var task = task.BuildTask(r.PostFormValue("OpenId"), r.PostFormValue("Title"), r.PostFormValue("Pusher"), r.PostFormValue("Content"), r.PostFormValue("Deadline"), r.PostFormValue("Urgency"))
		//还要将task填入个人的任务表，总任务表和任务负责人对应表
		var taskNode = new(utils.TaskNode)
		taskNode.Task = *task
		tree.GetForest().NewTask(r.PostFormValue("TreeId"), r.PostFormValue("Parent"), taskNode)
	} else {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		utils.CheckErr(err, "AddNewTreeNodes:empty para")
	}
}
