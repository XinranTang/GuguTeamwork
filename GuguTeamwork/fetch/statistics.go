package fetch

import (
	"encoding/json"
	"net/http"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

type statistic struct {
	Totaljoin   int
	TotalManage int
	Goingon     int
	Setback     int
	Done        int
}

type groupSta struct {
	Done    int
	NotDone int
}

func PersonalStatistics(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	db := sqlmanip.ConnectPersonalDB()
	defer sqlmanip.DisConnectDB(db)

	var data statistic
	db.QueryRow("SELECT totalmanage,totaljoin,goingon,setback,done FROM user_infor WHERE ID=?", r.Form["OpenId"][0]).Scan(&data.TotalManage, &data.Totaljoin, &data.Goingon, &data.Setback, &data.Done)
	output, err := json.MarshalIndent(&data, "", "\t\t")
	utils.CheckErr(err, "exist:json")
	w.Write(output)
}

func GroupStatistics(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	db := sqlmanip.ConnectPersonalDB()
	defer sqlmanip.DisConnectDB(db)
	var data groupSta
	db.QueryRow("SELECT done, notdone FROM user_task WHERE taskID=?", r.Form["TreeID"][0]).Scan(&data.Done, &data.NotDone)
	output, err := json.MarshalIndent(&data, "", "\t\t")
	utils.CheckErr(err, "exist:json")
	w.Write(output)
}
