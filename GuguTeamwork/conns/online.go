package conns

import (
	"encoding/json"
	"log"
	"net/http"

	"GuguTeamwork/sqlmanip"

	"github.com/gorilla/websocket"
)

var SendFaliureNotice = WsMsg{
	TypeCode: -1,
}

var ShutDownNotice = WsMsg{
	TypeCode: -127,
}

//该实例将一个tcp协议升级成ws协议
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

//务必在每次进入程序时调用
func Online(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	_, p, err := conn.ReadMessage()
	if err != nil {
		conn.Close()
		return
	}
	//启动一个专门监听一个连接的协程
	msgChan := make(chan WsMsg)
	go wsListener(msgChan, conn, string(p))
	pool.AddConn(string(p), msgChan)
}

func wsListener(msgChan chan WsMsg, conn *websocket.Conn, openid string) {
	var msg WsMsg
shutdown:
	for {
		select {
		case msg = <-msgChan:
			//检查是否是关闭信号
			if msg.TypeCode == -127 {
				conn.Close()
				close(msgChan)
				pool.RemoveConn(openid)
				break shutdown
			}
			output, err := json.MarshalIndent(msg, "", "\t\t")
			if err != nil {
				//序列化失败，发送终止,不过无所谓
			}
			err = conn.WriteMessage(websocket.TextMessage, output)
			if err != nil {
				//发送失败，连接断开
				conn.Close()
				close(msgChan)
				pool.RemoveConn(openid)
				break shutdown
			}
		default:
			err := conn.ReadJSON(&msg)
			log.Println("Got messages")
			if err != nil {
				//连接中断
				close(msgChan)
				conn.Close()
				pool.RemoveConn(openid)
				break shutdown
			}
			switch msg.TypeCode {
			case 100:
				//任务邀请
				msg.Timeout.AddDate(0, 0, 3)
				fallthrough
			case 101:
				//任务回执
				db := sqlmanip.ConnectTmpDB()
				//bad design
				stmt, err := db.Prepare("INSERT INTO WsMsg(Timeout,Sender,Receiver,TypeCode,ContentId) VALUES(?,?,?,?,?)")
				if err != nil {
					err = conn.WriteJSON(SendFaliureNotice)
					if err != nil {
						close(msgChan)
						conn.Close()
						pool.RemoveConn(openid)
						break shutdown
					}
				}
				_, err = stmt.Exec(msg.Timeout, msg.Sender, msg.Receiver, msg.TypeCode, msg.ContentId)
				if err != nil {
					err = conn.WriteJSON(SendFaliureNotice)
					if err != nil {
						close(msgChan)
						conn.Close()
						pool.RemoveConn(openid)
						break shutdown
					}
				}
				sqlmanip.DisConnectDB(db)
				//查看是否在线
				RConn := pool.GetConn(msg.Receiver)
				if RConn != nil {
					//在线，直接发送
					RConn <- msg
				}
				//不在线，无所谓
			case 10:
				//消息，直接存到对方的主表里
			}
		}
	}
}
