package test

import (
	"log"
	"os"
	"time"

	"GuguTeamwork/tree"
)

func Report() {
	log.Println("monitor started")
	monitorFile, err := os.Create("monitor.log")
	if err != nil {
		log.Fatalln("Fail to create log, program cracked.")
	}
	logger := log.New(monitorFile, "[Debug]:", log.LstdFlags)

	ticker := time.NewTicker(time.Second * 5)

	for {
		<-ticker.C
		logger.Println(tree.GetForest().Projects)
	}
}
