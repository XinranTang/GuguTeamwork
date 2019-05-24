package main

import (
	"net/http"

	"GuguTeamwork/cleaner"
	"GuguTeamwork/conns"
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
	//初始化连接池
	conns.InitConnPool()
	//启动常规任务协程
	go cleaner.CleanForest()
	go tree.DBFlusher()
	go utils.GetAccessToken()
	go test.Report()
	//路由服务
	//TCP服务
	mux := http.NewServeMux()
	mux.HandleFunc("/gugu/test", test.Test)
	mux.HandleFunc("/gugu/entry", fetch.Entry)
	mux.HandleFunc("/gugu/openIdEntry", fetch.OpenIdEntry)
	mux.HandleFunc("/gugu/getManageTrees", fetch.GetTrees)
	mux.HandleFunc("/gugu/newNode", fetch.AddNewTreeNodes)
	mux.HandleFunc("/gugu/newProject", fetch.NewProjectTree)
	mux.HandleFunc("/gugu/deleteNode", fetch.DropFromTree)
	mux.HandleFunc("/gugu/alterNode", fetch.AlterNode)
	mux.HandleFunc("/gugu/personal", fetch.Personal)
	mux.HandleFunc("/gugu/sendQR", fetch.MakeQR)
	mux.HandleFunc("/gugu/newMessage", fetch.NewMessage)
	mux.HandleFunc("/gugu/readMessage", fetch.ReadMessage)
	//WS服务
	mux.HandleFunc("/guguWss/online", conns.Online)
	mux.HandleFunc("/gugu/offline", conns.Offline)
	//静态资源服务
	fileServer := http.FileServer(http.Dir("public"))
	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	http.ListenAndServe("localhost:9000", mux)
}
