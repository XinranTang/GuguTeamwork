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
	//路由服务
	mux := http.NewServeMux()
	mux.HandleFunc("/test", test.Test)
	mux.HandleFunc("/entry", fetch.Entry)
	//静态资源服务
	fileServer := http.FileServer(http.Dir("public"))
	mux.Handle("/static/", http.StripPrefix("/static/", fileServer))

	http.ListenAndServe("localhost:9000", mux)
}
