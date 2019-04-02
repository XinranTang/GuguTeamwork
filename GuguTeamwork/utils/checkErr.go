package utils

import (
	"log"
)

func CheckErr(err error, info string) {
	if err != nil {
		recordError(err, info)
		log.Println(info)
		panic(err)
	}
}

func HasErr(err error) bool {
	if err != nil {
		return true
	} else {
		return false
	}
}

func recordError(err error, info string) {
	logger.Println(info)
	logger.Println(err)
}
