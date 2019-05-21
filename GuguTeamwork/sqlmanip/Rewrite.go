package sqlmanip

import (
	"database/sql"
	"strings"
	"time"

	"GuguTeamwork/utils"

	_ "github.com/mattn/go-sqlite3"
)

func RewriteAccessInfo(db *sql.DB, openid string) {
	var tempStr string
	var tempInt int
	err := db.QueryRow("SELECT LastTimeAccess,SuccessiveAccessDays FROM UserInfo WHERE OpenId LIKE ?", openid).Scan(&tempStr, &tempInt)
	utils.CheckErr(err, "RewriteAccessInfo:Query")
	Date, err := time.Parse("2006-01-02T15:04:05Z", tempStr)
	utils.CheckErr(err, "RewriteAccessInfo:Time parsing")
	if Date.AddDate(0, 0, 1).Format("20060102") == time.Now().Format("20060102") {
		err = RewriteItemInt(db, "UserInfo", "OpenId", "SuccessiveAccessDays", tempInt+1, openid)
		utils.CheckErr(err, "RewriteAccessInfo:write int")
		err = RewriteItemString(db, "UserInfo", "OpenId", "LastTimeAccess", time.Now().Format("2006-01-02T15:04:05Z"), openid)
		utils.CheckErr(err, "RewriteAccessInfo:write string")
	} else if Date.Format("20060102") == time.Now().Format("20060102") {
	} else {
		err = RewriteItemInt(db, "UserInfo", "OpenId", "SuccessiveAccessDays", 1, openid)
		utils.CheckErr(err, "RewriteAccessInfo:write int")
		err = RewriteItemString(db, "UserInfo", "OpenId", "LastTimeAccess", time.Now().Format("2006-01-02T15:04:05Z"), openid)
		utils.CheckErr(err, "RewriteAccessInfo:write string")
	}
}

func RewriteItemInt(db *sql.DB, table string, key string, header string, newValue int, keyValue string) error {
	order := "UPDATE " + table + " SET " + header + "=? WHERE " + key + "=?"
	stmt, err := db.Prepare(order)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(newValue, keyValue)
	if err != nil {
		return err
	}
	return nil
}

func RewriteItemString(db *sql.DB, table string, key string, header string, newValue string, keyValue string) error {
	order := "UPDATE " + table + " SET " + header + "=? WHERE " + key + "=?"
	stmt, err := db.Prepare(order)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(newValue, keyValue)
	if err != nil {
		return err
	}
	return nil
}

func FlushTreeData(db *sql.DB, table string, data []utils.TaskNode) error {
	if len(data) == 0 {
		var order = "DELETE FROM ProjectTrees WHERE TreeID=?"
		stmt, err := db.Prepare(order)
		if err != nil {
			return err
		}
		_, err = stmt.Exec(table)
		if err != nil {
			return err
		}
		order = "DROP TABLE " + table + ";"
		stmt, err = db.Prepare(order)
		if err != nil {
			//可能的情况是原本就未将这颗树刷入数据库
			if strings.Contains(err.Error(), "no such table") {
				return nil
			} else {
				return err
			}
		}
		_, err = stmt.Exec()
		if err != nil {
			return err
		}
	} else {
		//制作副本
		var replica = table + "_replica"
		var order = "CREATE TABLE " + replica + " AS SELECT * FROM " + table + " WHERE 1=0;"
		stmt, err := db.Prepare(order)
		if err != nil {
			//可能的情况是之前不存在新添加的树
			order = "INSERT INTO ProjectTrees(TreeID, ProjectName) VALUES(?,?)"
			stmt, err = db.Prepare(order)
			if err != nil {
				return err
			}
			_, err = stmt.Exec(table, data[0].Task.Title)
			if err != nil {
				return err
			}
			order = "CREATE TABLE " + replica + "(TaskID TEXT,Self INT,Child TEXT);"
			stmt, err = db.Prepare(order)
			if err != nil {
				return err
			}
		}
		_, err = stmt.Exec()
		if err != nil {
			return err
		}

		//更新了任务树库
		for _, v := range data {
			order = "INSERT INTO " + replica + "(TaskID, Self, Child) VALUES(?,?,?)"
			stmt, err := db.Prepare(order)
			if err != nil {
				return err
			}
			_, err = stmt.Exec(v.Task.TaskID, v.Self, utils.MakeTaskNodeInDBChild(v.Child))
			if err != nil {
				return err
			}
		}

		order = "DROP TABLE " + table + ";"
		//可能的情况是之前没有这棵树
		stmt, err = db.Prepare(order)
		if err == nil {
			_, err = stmt.Exec()
			if err != nil {
				return err
			}
		}

		order = "ALTER TABLE " + replica + " RENAME To " + table + ";"
		stmt, err = db.Prepare(order)
		if err != nil {
			return err
		}
		_, err = stmt.Exec()
		if err != nil {
			return err
		}
	}
	stmt, err := db.Prepare("COMMIT")
	if err != nil {
		return err
	}
	_, err = stmt.Exec()
	if err != nil {
		return err
	}
	stmt, err = db.Prepare("BEGIN TRANSACTION")
	if err != nil {
		return err
	}
	_, err = stmt.Exec()
	if err != nil {
		return err
	}

	return nil
}

func FlushTaskData(db *sql.DB, opes []*utils.Ope, data map[string][]utils.TaskNode) error {
	var order string
	var t utils.TaskNode
	for _, v := range opes {
		for _, t = range data[v.TreeID] {
			if t.Task.TaskID == v.TaskID {
				break
			}
		}
		switch v.Manip {
		case -1:
			order = "DELETE FROM Tasks WHERE TaskID=?"
			stmt, err := db.Prepare(order)
			if err != nil {
				return err
			}
			_, err = stmt.Exec(v.TaskID)
			if err != nil {
				return err
			}
			order = "DELETE FROM TaskToPeople WHERE TaskID=?"
			stmt, err = db.Prepare(order)
			if err != nil {
				return err
			}
			_, err = stmt.Exec(v.TaskID)
			if err != nil {
				return err
			}
			var ts string
			for _, j := range v.DeleteMember {
				order = "SELECT Tasks FROM UserInfo WHERE OpenId='" + j + "';"
				err = db.QueryRow(order).Scan(&ts)
				if err != nil {
					return err
				}
				order = "UPDATE UserInfo SET Tasks=? WHERE OpenId=?"
				stmt, err = db.Prepare(order)
				if err != nil {
					return err
				}
				start := strings.Index(ts, v.TaskID)
				end := utils.Find(ts, ";", start) + 1
				_, err = stmt.Exec(ts[:start]+ts[end:], j)
				if err != nil {
					return err
				}
				if v.TaskID == v.TreeID {
					order = "SELECT Manage FROM UserInfo WHERE OpenId='" + j + "';"
					err = db.QueryRow(order).Scan(&ts)
					if err != nil {
						return err
					}
					order = "UPDATE UserInfo SET Manage=? WHERE OpenId=?"
					stmt, err = db.Prepare(order)
					if err != nil {
						return err
					}
					start := strings.Index(ts, v.TaskID)
					if start >= 0 {
						end := utils.Find(ts, ";", start) + 1
						_, err = stmt.Exec(ts[:start]+ts[end:], j)
						if err != nil {
							return err
						}
					}
				}
			}
		case 0:
			order = "UPDATE Tasks SET Title=?,Pusher=?,Content=?,Status=?,PushDate=?,DeadLine=?,Urgency=? WHERE TaskID=?"
			stmt, err := db.Prepare(order)
			if err != nil {
				return err
			}
			_, err = stmt.Exec(t.Task.Title, t.Task.Pusher, t.Task.Content, t.Task.Status, t.Task.PushDate, t.Task.DeadLine, t.Task.Urgency, t.Task.TaskID)
			if err != nil {
				return err
			}
			var ts string
			order = "SELECT Receiver FROM TaskToPeople WHERE TaskID='" + t.Task.TaskID + "';"
			err = db.QueryRow(order).Scan(&ts)
			if err != nil {
				return err
			}
			order = "UPDATE TaskToPeople set Receiver=? WHERE TaskID=?"
			stmt, err = db.Prepare(order)
			if err != nil {
				return err
			}
			_, err = stmt.Exec(utils.MakeSemicolonStr(t.TeamMates), t.Task.TaskID)
			if err != nil {
				return err
			}
			tsl := utils.ParseManage(ts)
			for _, v := range tsl {
				flag := true
				for _, j := range t.TeamMates {
					if v == j {
						flag = false
						break
					}
				}
				if flag {
					order = "SELECT Tasks FROM UserInfo WHERE OpenId='" + v + "';"
					err = db.QueryRow(order).Scan(&ts)
					if err != nil {
						return err
					}
					order = "UPDATE UserInfo SET Tasks=? WHERE OpenId=?"
					stmt, err = db.Prepare(order)
					if err != nil {
						return err
					}
					start := strings.Index(ts, t.Task.TaskID)
					end := utils.Find(ts, ";", start) + 1
					_, err = stmt.Exec(ts[:start]+ts[end:], v)
					if err != nil {
						return err
					}
				}
			}
			for _, v := range t.TeamMates {
				flag := true
				for _, j := range tsl {
					if v == j {
						flag = false
						break
					}
				}
				if flag {
					order = "SELECT Tasks FROM UserInfo WHERE OpenId='" + v + "';"
					err = db.QueryRow(order).Scan(&ts)
					if err != nil {
						return err
					}
					order = "UPDATE UserInfo SET Tasks=? WHERE OpenId=?"
					stmt, err = db.Prepare(order)
					if err != nil {
						return err
					}
					_, err = stmt.Exec(ts+t.Task.TaskID+";", v)
					if err != nil {
						return err
					}
				}
			}
		case 1:
			var ts string
			if t.Task.TaskID == v.TreeID {
				order = "SELECT Manage FROM UserInfo WHERE OpenId='" + t.Task.Pusher + "';"
				err := db.QueryRow(order).Scan(&ts)
				order = "UPDATE UserInfo SET Manage=? WHERE OpenId=?"
				stmt, err := db.Prepare(order)
				if err != nil {
					return err
				}
				_, err = stmt.Exec(ts+v.TreeID+";", t.Task.Pusher)
				if err != nil {
					return err
				}
			}
			order = "INSERT INTO Tasks(TaskID,Title,Pusher,Content,Status,PushDate,DeadLine,Urgency) VALUES(?,?,?,?,?,?,?,?)"
			stmt, err := db.Prepare(order)
			if err != nil {
				return err
			}
			_, err = stmt.Exec(t.Task.TaskID, t.Task.Title, t.Task.Pusher, t.Task.Content, t.Task.Status, t.Task.PushDate, t.Task.DeadLine, t.Task.Urgency)
			if err != nil {
				return err
			}
			order = "INSERT INTO TaskToPeople(TaskID,Receiver) VALUES(?,?)"
			stmt, err = db.Prepare(order)
			if err != nil {
				return err
			}
			_, err = stmt.Exec(t.Task.TaskID, utils.MakeSemicolonStr(t.TeamMates))
			if err != nil {
				return err
			}
			for _, v := range t.TeamMates {
				order = "SELECT Tasks FROM UserInfo WHERE OpenId='" + v + "';"
				err = db.QueryRow(order).Scan(&ts)
				if err != nil {
					return err
				}
				order = "UPDATE UserInfo SET Tasks=? WHERE OpenId=?"
				stmt, err = db.Prepare(order)
				if err != nil {
					return err
				}
				_, err = stmt.Exec(ts+t.Task.TaskID+";", v)
				if err != nil {
					return err
				}
			}
		default:
			return new(utils.OtherError)
		}
		stmt, err := db.Prepare("COMMIT")
		if err != nil {
			return err
		}
		_, err = stmt.Exec()
		if err != nil {
			return err
		}
		stmt, err = db.Prepare("BEGIN TRANSACTION")
		if err != nil {
			return err
		}
		_, err = stmt.Exec()
		if err != nil {
			return err
		}
	}
	return nil
}
