package utils

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

const appId = "wx8c3088cb35bde298"
const appSecret = "b21e1519aee1dee83b8e66f360aa282a"

func GetOpenIdFromTencent(code string) *TencentRes {
	var url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appId + "&secret=" + appSecret + "&js_code=" + code + "&grant_type=authorization_code"
	resp, err := http.Get(url)
	CheckErr(err, "GetOpenIdFromTencent:get")
	defer resp.Body.Close()

	object, err := ioutil.ReadAll(resp.Body)
	CheckErr(err, "Mistakes happen when parsing response")

	var ATencentRes TencentRes
	err = json.Unmarshal(object, &ATencentRes)
	CheckErr(err, "GetOpenIdFromTencent:json")

	return &ATencentRes
}
