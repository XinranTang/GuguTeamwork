package fetch

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"GuguTeamwork/conns"
	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/task"
	"GuguTeamwork/utils"
)

type NewMessageData struct {
	Title           string
	Pusher          string
	Content         string
	NotRead         string
	FinalDeleteDate string
}

func NewMessage(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	utils.CheckErr(err, "NewMessage:read data")
	var ANewMessageData NewMessageData
	err = json.Unmarshal(data, &ANewMessageData)
	utils.CheckErr(err, "NewMessage:parse data")
	r.Body.Close()

	if !utils.CheckEmp(ANewMessageData.Title, ANewMessageData.Pusher, ANewMessageData.Content, ANewMessageData.NotRead) {
		err := new(utils.EmptyPostFormValueError)
		err.DealWithError(w)
		return
	}
	message, err := task.BuildMessage(ANewMessageData.Title, ANewMessageData.Pusher, ANewMessageData.Content, ANewMessageData.NotRead, ANewMessageData.FinalDeleteDate)
	if err != nil {
		utils.CheckErr(err, "NewMessage:build message")
	}
	//加入数据库
	db := sqlmanip.ConnetUserDB()
	sqlmanip.CreateMessage(db, message)
	sqlmanip.DisConnectDB(db)
	//进行发送
	for _, v := range utils.ParseManage(ANewMessageData.NotRead) {
		conn := conns.GetConnPool().GetConn(v)
		if conn != nil {
			var msg = conns.WsMsg{
				TypeCode:  10,
				Sender:    ANewMessageData.Pusher,
				Receiver:  v,
				ContentId: message.MessageID,
			}
			conn <- msg
		}
	}
}
