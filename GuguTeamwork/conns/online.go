package conns

import (
	"encoding/json"
	"net/http"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/tree"
	"GuguTeamwork/utils"

	"github.com/gorilla/websocket"
)

var SendFaliureNotice = WsMsg{
	TypeCode: -1,
}

var ShutDownNotice = WsMsg{
	TypeCode: -127,
}

var ReadClodeNotice = WsMsg{
	TypeCode: -125,
}

var NotExistNotice = WsMsg{
	TypeCode: -126,
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
	if pool.GetConn(string(p)) != nil {
		return
	}
	//启动一个专门监听一个连接的协程
	msgChan := make(chan WsMsg, 5)
	go wsListener(msgChan, conn, string(p))
	pool.AddConn(string(p), msgChan)

	//向服务端报告离线时的信息
	tdb := sqlmanip.ConnectTmpDB()
	//bad design
	rows, err := tdb.Query("SELECT * FROM WsMsg WHERE Receiver=?", string(p))
	var msg WsMsg
	var tmpInt int
	for rows.Next() {
		err := rows.Scan(&msg.Timeout, &msg.Sender, &msg.Receiver, &tmpInt, &msg.ContentId)
		utils.CheckErr(err, "entry:prepare tmp")
		msg.TypeCode = int8(tmpInt)
		msgChan <- msg
		if msg.TypeCode == 51 || msg.TypeCode == 52 {
			sqlmanip.DeleteFromDB(tdb, "TaskCheckRequest", "ContentId", msg.ContentId)
		}
	}
	sqlmanip.DisConnectDB(tdb)
}

func wsListener(msgChan chan WsMsg, conn *websocket.Conn, openid string) {
	var msg WsMsg
	var flag = int8(0)
	readChan := make(chan WsMsg, 3)
	go wsReader(readChan, conn)
	for {
		select {
		case msg = <-msgChan:
			//检查是否是关闭信号
			if msg.TypeCode == -127 {
				conn.Close()
				break
			}
			if msg.TypeCode == -125 {
				close(readChan)
				close(msgChan)
				pool.RemoveConn(openid)
				return
			}
			output, err := json.MarshalIndent(msg, "", "\t\t")
			if err != nil {
				//序列化失败，发送终止
			}
			err = conn.WriteMessage(websocket.TextMessage, output)
			if err != nil {
				//发送失败，连接断开
				msgChan <- ShutDownNotice
				break
			}
		case msg = <-readChan:
			if msg.TypeCode == -125 {
				//连接中断
				msgChan <- ReadClodeNotice
				break
			}
			switch msg.TypeCode {
			case 101:
				//同意加入任务
				fallthrough
			case 51:
				//任务审批通过

				//同步队伍信息
				tmp := utils.ParseManage(msg.ContentId)
				tree.SafeTreeManip(tmp[0])
				tree.GetForest().PRMMutex.Lock()
				{
					for k, _ := range tree.GetForest().Projects[tmp[0]] {
						if tree.GetForest().Projects[tmp[0]][k].Task.TaskID == tmp[1] {
							t := tree.GetForest().Projects[tmp[0]][k].TeamMates
							//检查t中是否已经含有该成员
							var have = false
							for k, _ := range t {
								if t[k] == msg.Sender {
									have = true
									break
								}
							}
							//并未找到该成员,且在101状态码下添加
							if !have && (msg.TypeCode == 101) {
								t = append(t, msg.Sender)
								flag = 1
							} else if !have && (msg.TypeCode == 51) {
								//该任务不存在但是是51状态码，想批准的任务已经被删除了
								msgChan <- NotExistNotice
							} else if have && (msg.TypeCode == 51) {
								//任务存在且是51状态码
								t = append(t[:k], t[k+1:]...)
								//如果删掉了最后一个teamMate这个任务也就做完了
								if len(t) == 0 {
									tree.GetForest().Projects[tmp[0]][k].Task.Status = 1
								}
								flag = 2
							}
							//存在且是101码时无所谓
							tree.GetForest().Projects[tmp[0]][k].TeamMates = t
						}
					}
				}
				tree.GetForest().PRMMutex.Unlock()

				//减少锁内代码
				//任务对于Receiver来说完成了,放到Completer里面去
				if flag == 2 {
					db := sqlmanip.ConnetUserDB()
					err := sqlmanip.Append(db, "TaskToPeople", "TaskID", "Completer", msg.Receiver+";", tmp[1])
					utils.CheckErr(err, "wsListener:move to completer")
					sqlmanip.DisConnectDB(db)
					sqlmanip.IncDec("user_task", "taskID", "done", tmp[1], true)
					sqlmanip.IncDec("user_task", "taskID", "notdone", tmp[1], false)
					sqlmanip.IncDec("user_infor", "ID", "goingon", msg.Receiver, false)
				} else if flag == 1 {
					if tmp[1] == tmp[0] {
						sqlmanip.IncDec("user_infor", "ID", "totalmanage", msg.Sender, true)
					} else {
						sqlmanip.IncDec("user_infor", "ID", "toaljoin", msg.Sender, false)
					}
					sqlmanip.IncDec("user_infor", "ID", "goingon", msg.Sender, true)
				}
				flag = 0

				tree.GetForest().MRMMutex.Lock()
				{
					t := tree.GetForest().Monitors[tmp[0]]
					t.UpdateSig = true
					tree.GetForest().Monitors[tmp[0]] = t
				}
				tree.GetForest().MRMMutex.Unlock()
				ope := tree.BuildOpe(tmp[0], tmp[1], int8(0))
				tree.GetForest().ORMMutex.Lock()
				{
					tree.GetForest().Opes.Push(ope)
				}
				tree.GetForest().ORMMutex.Unlock()
				fallthrough
			case 102:
				//拒绝加入任务
				fallthrough
			case 52:
				//拒绝通过任务
				//删除回应的离线消息
				db := sqlmanip.ConnectTmpDB()
				if msg.TypeCode == 51 {
					sqlmanip.DeleteFromDB(db, "TaskCheckRequest", "ContentId", msg.ContentId)
				} else {
					sqlmanip.DeleteFromDB(db, "WsMsg", "ContentId", msg.ContentId)
				}
				sqlmanip.DisConnectDB(db)
				//如果在线向任务发起者进行回报
				RConn := pool.GetConn(msg.Receiver)
				if RConn != nil {
					RConn <- msg
				} else {
					if msg.TypeCode == 51 || msg.TypeCode == 52 {
						//51,52状态码需要存入临时库
						stmt, _ := db.Prepare("INSERT INTO TaskCheckRequest(Timeout,Sender,Receiver,TypeCode,ContentId) VALUES(?,?,?,?,?)")
						stmt.Exec(msg.Timeout, msg.Sender, msg.Receiver, msg.TypeCode, msg.ContentId)
					}
				}
			case 100:
				//任务邀请
				fallthrough
			case 50:
				//发起任务审核
				msg.Timeout.AddDate(0, 0, 3)
				db := sqlmanip.ConnectTmpDB()
				//bad design
				var order string
				if msg.TypeCode == 100 {
					order = "INSERT INTO WsMsg(Timeout,Sender,Receiver,TypeCode,ContentId) VALUES(?,?,?,?,?)"
				} else if msg.TypeCode == 50 || msg.TypeCode == 51 {
					order = "INSERT INTO TaskCheckRequest(Timeout,Sender,Receiver,TypeCode,ContentId) VALUES(?,?,?,?,?)"
				}
				stmt, err := db.Prepare(order)
				if err != nil {
					err = conn.WriteJSON(SendFaliureNotice)
					if err != nil {
						msgChan <- ShutDownNotice
						break
					}
				}
				_, err = stmt.Exec(msg.Timeout, msg.Sender, msg.Receiver, msg.TypeCode, msg.ContentId)
				if err != nil {
					err = conn.WriteJSON(SendFaliureNotice)
					if err != nil {
						msgChan <- ShutDownNotice
						break
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
			}
		}
	}
}

func wsReader(readChan chan WsMsg, conn *websocket.Conn) {
	var msg WsMsg
	for {
		err := conn.ReadJSON(&msg)
		if err != nil {
			readChan <- ReadClodeNotice
			return
		}
		if msg.TypeCode == -127 {
			readChan <- ReadClodeNotice
			return
		}
		readChan <- msg
	}
}
