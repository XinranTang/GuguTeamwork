package utils

import (
	"log"
	"os"
)

var logger *log.Logger

func StartLogger() *os.File {
	//日志记录服务
	logFile, err := os.Create("log.log")
	if err != nil {
		log.Fatalln("Fail to create log, program cracked.")
	}
	logger = log.New(logFile, "[Debug]:", log.LstdFlags)
	logger.Println("Logger started")
	return logFile
}

func ShutdownLogger(logFile *os.File) {
	logFile.Close()
}

func Logger() *log.Logger {
	return logger
}

func RecordError(err error) {
	logger.Println(err)
}
