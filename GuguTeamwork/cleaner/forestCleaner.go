package cleaner

import (
	"log"
	"time"

	"GuguTeamwork/tree"
)

const forestScanInterval = time.Second * 5

func CleanForest() {
	log.Println("cleaner started.")
	for {
		tree.GetForest().PRMMutex.Lock()
		{
			for k, v := range tree.GetForest().Monitors {
				if len(v.Timer.C) > 0 {
					delete(tree.GetForest().Projects, k)
					delete(tree.GetForest().Monitors, k)
					log.Println(k + " time out")
					log.Println(tree.GetForest().Projects)
				}
			}
		}
		tree.GetForest().PRMMutex.Unlock()
		time.Sleep(forestScanInterval)
	}
}
