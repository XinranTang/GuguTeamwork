package tree

import (
	"log"
	"time"

	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
)

//每隔这个时间会将新的信息刷到数据库内
const dBFlushInterval = time.Second * 80

func DBFlusher() {
	log.Println("Flusher started")
	var collector []string
	var update map[string][]utils.TaskNode
	var opes []*utils.Ope
	var ticker = time.NewTicker(dBFlushInterval)

	for {
		<-ticker.C
		update = make(map[string][]utils.TaskNode)
		forest.MRMMutex.Lock()
		{
			for k, v := range forest.Monitors {
				if v.UpdateSig == true {
					collector = append(collector, k)
					v.UpdateSig = false
				}
			}
		}
		forest.MRMMutex.Unlock()
		forest.ORMMutex.RLock()
		forest.PRMMutex.RLock()
		for _, v := range collector {
			update[v] = forest.Projects[v]
		}
		forest.PRMMutex.RUnlock()
		{
			for {
				if forest.Opes.IsEmp() {
					break
				}
				t := forest.Opes.PoP().(*utils.Ope)
				opes = append(opes, t)
			}
		}
		forest.ORMMutex.RUnlock()
		collector = collector[0:0]
		db := sqlmanip.ConnectTaskDB()
		for k, v := range update {
			err := sqlmanip.FlushTreeData(db, k, v)
			utils.CheckErr(err, "DBFlusher:flush tree")
		}
		sqlmanip.DisConnectDB(db)
		db = sqlmanip.ConnetUserDB()
		err := sqlmanip.FlushTaskData(db, opes, update)
		utils.CheckErr(err, "DBFlusher:flush tasks")
		sqlmanip.DisConnectDB(db)
		//清空opes
		opes = opes[0:0]

		log.Println("Flush success")
	}
}
