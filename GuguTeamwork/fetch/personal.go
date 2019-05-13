package fetch

import (
	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
	"encoding/json"
	"net/http"
)

//传openid返回个人信息
func Personal(w http.ResponseWriter, r *http.Request) {
	if !utils.CheckEmp(r.PostFormValue("OpenId")) {
		w.WriteHeader(403)
		return
	}
	db := sqlmanip.ConnectPersonalDB()
	output, err := json.MarshalIndent(sqlmanip.QueryPrivateInfo(db, r.PostFormValue("OpenId")), "", "\t\t")
	utils.CheckErr(err, "Personal:transfer to json")
	sqlmanip.DisConnectDB(db)

	w.Header().Set("Content-type", "application/json")
	w.Write(output)
}
