package fetch

import (
	"encoding/json"
	"log"
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
	for _, v := range utils.ParseManage(sqlmanip.QueryStringToString(db, "Manage", "UserInfo", r.PostFormValue("OpenId"))) {
		treeWithId.TreeId = v
		treeWithId.Tree = tree.GetForest().GetProjects()[v]
		trees = append(trees, treeWithId)
	}

	output, err := json.MarshalIndent(trees, "", "\t\t")
	utils.CheckErr(err)
	w.Header().Set("Content-type", "application/json")
	w.Write(output)
}

//这个处理器负责在一颗树上新建节点
func AddNewTreeNodes(w http.ResponseWriter, r *http.Request) {
	var task = task.BuildTask(r.PostFormValue("TaskID"), r.PostFormValue("Pusher"), r.PostFormValue("Content"), r.PostFormValue("Deadline"), r.PostFormValue("Urgency"))
	//还要将task填入个人的任务表，和任务负责人对应表

	//
	var taskNode utils.TaskNode
	taskNode.Task = *task
	log.Println(r.PostFormValue("TreeId"), r.PostFormValue("Parent"))
	tree.GetForest().NewTask(r.PostFormValue("TreeId"), r.PostFormValue("Parent"), &taskNode)
	log.Println(tree.GetForest().GetProjects())
}
