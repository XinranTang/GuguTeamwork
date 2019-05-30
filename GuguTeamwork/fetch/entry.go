package fetch

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

const tryLoop = 3

func Entry(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	db := sqlmanip.ConnetUserDB()
	defer sqlmanip.DisConnectDB(db)
	var output []byte
	ATencentRes := utils.GetOpenIdFromTencent(r.Form["code"][0])
	if ATencentRes.Errcode != 0 {
		var tryTime = 0
		if ATencentRes.Errcode == -1 {
			for ATencentRes.Errcode == -1 && tryTime < tryLoop {
				ATencentRes = utils.GetOpenIdFromTencent(r.Form["code"][0])
				tryTime++
			}
			if ATencentRes.Errcode == -1 {
				err := new(utils.TencentError)
				err.DealWithError(w, ATencentRes)
				return
			}
		} else {
			err := new(utils.TencentError)
			err.DealWithError(w, ATencentRes)
			return
		}
	}
	deltStr := strings.Replace(ATencentRes.Openid, "-", "_", -1)
	if !try(db, deltStr) {
		output = exist(db, deltStr)
	} else {
		//		var AWxInfo utils.WxUserInfo
		//		AWxInfo.ID = deltStr
		//		AWxInfo.NickName = r.Form["nickName"][0]
		//		AWxInfo.Sex = r.Form["sex"][0]
		//		AWxInfo.City = r.Form["city"][0]
		//		AWxInfo.Country = r.Form["country"][0]
		//		AWxInfo.Province = r.Form["province"][0]
		//		AWxInfo.HeadImage = r.Form["headurl"][0]
		//		err := sqlmanip.CreatePrivateInfo(&AWxInfo)
		//		utils.CheckErr(err, "Entry:private info")
		output = nonexsit(db, deltStr)
	}

	w.Header().Set("Content-type", "application/json")
	w.Write(output)
}

func OpenIdEntry(w http.ResponseWriter, r *http.Request) {
	db := sqlmanip.ConnetUserDB()
	defer sqlmanip.DisConnectDB(db)
	if !utils.CheckEmp(r.PostFormValue("OpenId")) {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		return
	}
	output := exist(db, r.PostFormValue("OpenId"))
	w.Header().Set("Content-type", "application/json")
	w.Write(output)
}

func try(db *sql.DB, openid string) bool {
	return sqlmanip.Try(db, openid)
}

func exist(db *sql.DB, openid string) []byte {
	UserInfo := sqlmanip.QueryUserInfo(db, openid)
	log.Println("exist")
	log.Println(UserInfo)
	sqlmanip.RewriteAccessInfo(db, openid)

	output, err := json.MarshalIndent(UserInfo, "", "\t\t")
	utils.CheckErr(err, "exist:json")
	//output, err = utils.Utf8ToGbk(output)
	//utils.CheckErr(err, "exist:utf8togbk")

	return output
}

func nonexsit(db *sql.DB, openid string) []byte {
	sqlmanip.CreateNewUser(db, openid)
	var UserInfo = utils.UserInfo{
		Messages:             nil,
		Tasks:                nil,
		Manage:               "",
		OpenId:               openid,
		LastTimeAccess:       time.Now(),
		SuccessiveAccessDays: 1,
		Level:                "lowLevel",
	}
	output, err := json.MarshalIndent(UserInfo, "", "\t\t")
	utils.CheckErr(err, "nonexist:json")
	//output, err = utils.Utf8ToGbk(output)
	//utils.CheckErr(err, "nonexist:utf8togbk")

	return output
}
