package utils

import (
	"fmt"
	"log"
	"os"
	"time"
)

const (
	ColorReset  = "\033[0m"
	ColorRed    = "\033[31m"
	ColorGreen  = "\033[32m"
	ColorYellow = "\033[33m"
	ColorBlue   = "\033[34m"
)

var (
	logFile *os.File
	Logger  *log.Logger
)

func InitLogger() error {
	logDir := "../logs"
	if _, err := os.Stat(logDir); os.IsNotExist(err) {
		err := os.MkdirAll(logDir, os.ModePerm)
		if err != nil {
			return fmt.Errorf("cannot create logs directory: %v", err)
		}
	}
	logFile, err := os.OpenFile("../logs/app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	Logger = log.New(logFile, "", log.LstdFlags)
	return nil
}

func Log(level string, message string) {
	color := ""
	prefix := ""

	switch level {
	case "INFO":
		color = ColorGreen
		prefix = "[INFO] "
	case "WARNING":
		color = ColorYellow
		prefix = "[WARNING] "
	case "ERROR":
		color = ColorRed
		prefix = "[ERROR] "
	default:
		color = ColorBlue
		prefix = "[LOG] "
	}

	timestamp := time.Now().Format("2006-01-02 15:04:05")
	if Logger != nil {
		Logger.Println(prefix + timestamp + " - " + message)
	}
	fmt.Println(color + prefix + timestamp + " - " + message + ColorReset)
}

func CloseLogger() {
	if logFile != nil {
		logFile.Close()
	}
}
