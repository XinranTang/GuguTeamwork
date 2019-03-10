package utils

import (
	"time"
)

type UserInfo struct {
	Messages             []Message
	Tasks                []Task
	OpenId               string
	LastTimeAccess       time.Time
	SuccessiveAccessDays int64
	Level                string
}

type Message struct {
	Title           string
	Pusher          string
	Content         string
	Status          bool
	PushDate        time.Time
	FinalDeleteDate time.Time
}

type Task struct {
	Title    string
	Pusher   string
	Content  string
	Status   bool
	PushDate time.Time
	DeadLine time.Time
	Urgency  int8
}
