package cleaner

import (
	"log"
	"time"

	"GuguTeamwork/tree"
)

//每隔这个时间清理者会扫描清除已经超时的树
const forestScanInterval = time.Second * 10

func CleanForest() {
	log.Println("cleaner started.")
	for {
		tree.GetForest().PRMMutex.Lock()
		{
			for k, v := range tree.GetForest().Monitors {
				if len(v.Timer.C) > 0 {
					delete(tree.GetForest().Projects, k)
					delete(tree.GetForest().Monitors, k)
					log.Println(k + " timeout")
					log.Println(tree.GetForest().Projects)
				}
			}
		}
		tree.GetForest().PRMMutex.Unlock()
		time.Sleep(forestScanInterval)
	}
}
