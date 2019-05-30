package cleaner

//import (
//	"time"

//	"GuguTeamwork/sqlmanip"
//	"GuguTeamwork/utils"
//)

////taskCleaner定期扫描数据库删除过期的数据，包括任务，消息
//const scanInterval = time.Minute * 1

//func taskCleaner() {
//	for {
//		//首先扫描过期的任务，超过dealine三天的任务被视为过期
//		db := sqlmanip.ConnetUserDB()
//		rows, err := db.Query("SELECT TaskID,DeadLine from Tasks")

//		time.Sleep(scanInterval)
//	}
//}
