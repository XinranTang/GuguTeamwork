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
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		return
	}
	db := sqlmanip.ConnectPersonalDB()
	output, err := json.MarshalIndent(sqlmanip.QueryPrivateInfo(db, r.PostFormValue("OpenId")), "", "\t\t")
	utils.CheckErr(err, "Personal:transfer to json")
	sqlmanip.DisConnectDB(db)

	w.Header().Set("Content-type", "application/json")
	w.Write(output)
}

//使用get方法访问
func SetPersonal(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	if !utils.CheckEmp(r.Form["ID"][0], r.Form["Name"][0]) {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		return
	}
	db := sqlmanip.ConnectPersonalDB()
	for k, _ := range r.Form {
		if r.Form[k][0] != "" {
			sqlmanip.RewriteItemString(db, "user_infor", "ID", k, r.Form[k][0], r.Form["ID"][0])
		}
	}
	sqlmanip.DisConnectDB(db)
}
