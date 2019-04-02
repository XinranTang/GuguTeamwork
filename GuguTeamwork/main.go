package main

import (
	"net/http"

	"GuguTeamwork/fetch"
	"GuguTeamwork/test"
	"GuguTeamwork/tree"
	"GuguTeamwork/utils"
)

func main() {
	//日志记录服务
	logFile := utils.StartLogger()
	defer utils.ShutdownLogger(logFile)
	//初始化任务森林
	tree.BuildForest()
	tree.GetForest().InitForest()
	//路由服务
	mux := http.NewServeMux()
	mux.HandleFunc("/gugu/test", test.Test)
	mux.HandleFunc("/gugu/entry", fetch.Entry)
	mux.HandleFunc("/gugu/openIdEntry", fetch.OpenIdEntry)
	mux.HandleFunc("/gugu/getManageTrees", fetch.Trees)
	mux.HandleFunc("/gugu/newNodes", fetch.AddNewTreeNodes)
	//静态资源服务
	fileServer := http.FileServer(http.Dir("public"))
	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	http.ListenAndServe("localhost:9000", mux)
}
