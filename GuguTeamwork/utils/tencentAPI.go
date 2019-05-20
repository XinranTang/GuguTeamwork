package utils

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"
)

const appId = "wx8c3088cb35bde298"
const appSecret = "b21e1519aee1dee83b8e66f360aa282a"

var AccessToken string

type ATRes struct {
	Access_token string
	Expires_in   int
	Errcode      int
	Errmsg       string
}

type MiniProgCodePara struct {
	Scene string
	Page  string
	Width int
}

func GetAccessToken() {
	var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + appId + "&secret=" + appSecret
	timer := time.NewTimer(time.Minute * 115)
	var retries = 5
	for {
		resp, err := http.Get(url)
		defer resp.Body.Close()

		object, err := ioutil.ReadAll(resp.Body)
		CheckErr(err, "GetAccessToken:read resp")

		var AATRes ATRes
		err = json.Unmarshal(object, &AATRes)
		CheckErr(err, "GetAccessToken:parse json")
		if AATRes.Errcode != 0 {
			if AATRes.Errcode == -1 {
				if retries != 0 {
					continue
				}
				retries = 5
			}
		}
		AccessToken = AATRes.Access_token
		timer.Reset(time.Second * time.Duration(AATRes.Expires_in-10))
		<-timer.C
	}
}

func GetOpenIdFromTencent(code string) *TencentRes {
	var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appId + "&secret=" + appSecret + "&js_code=" + code + "&grant_type=authorization_code"
	resp, err := http.Get(url)
	CheckErr(err, "GetOpenIdFromTencent:get")
	defer resp.Body.Close()

	object, err := ioutil.ReadAll(resp.Body)
	CheckErr(err, "GetOpenIdFromTencent:read resp")

	var ATencentRes TencentRes
	err = json.Unmarshal(object, &ATencentRes)
	CheckErr(err, "GetOpenIdFromTencent:json")

	return &ATencentRes
}

func GetInvitation(data []byte) []byte {
	var url = "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + AccessToken

	resp, err := http.NewRequest("POST", url, bytes.NewReader(data))
	CheckErr(err, "GetInvitation:post")
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	CheckErr(err, "GetInvitaion:read body")
	return body
}
