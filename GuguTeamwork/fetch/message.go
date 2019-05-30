package fetch

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"

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

func MakeQR(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	utils.CheckErr(err, "MakeInvitation:read data")
	r.Body.Close()

	res := utils.GetInvitation(data)
	w.Write(res)
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

func ReadMessage(w http.ResponseWriter, r *http.Request) {
	db := sqlmanip.ConnetUserDB()
	defer sqlmanip.DisConnectDB(db)

	r.ParseForm()
	notRead, err := sqlmanip.QueryMessageIDToString(db, "NotRead", "Messages", r.Form["MessageID"][0])
	utils.CheckErr(err, "ReadMessage:query notread in db")
	s := strings.Index(notRead, r.Form["OpenId"][0])
	if s == -1 {
		w.WriteHeader(300)
		w.Write([]byte("User have read the message or do not have the message."))
		return
	}
	e := utils.Find(notRead, ";", s) + 1
	if e >= len(notRead) {
		notRead = notRead[0:s]
	} else {
		notRead = notRead[0:s] + notRead[e:]
	}
	err = sqlmanip.RewriteItemString(db, "Messages", "MessageID", "NotRead", notRead, r.Form["MessageID"][0])
	utils.CheckErr(err, "ReadMessage:reset not read in db")
	err = sqlmanip.Append(db, "Messages", "MessageID", "HaveRead", r.Form["OpenId"][0]+";", r.Form["MessageID"][0])
	utils.CheckErr(err, "ReadMessage:set read in db")
}
