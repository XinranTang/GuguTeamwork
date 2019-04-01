package utils

import (
	"time"
)

type UserInfo struct {
	Messages             []Message
	Tasks                []Task
	Manage               string
	OpenId               string
	LastTimeAccess       time.Time
	SuccessiveAccessDays int64
	Level                string
}

type Message struct {
	MessageID       string
	Title           string
	Pusher          string
	Content         string
	Status          bool
	PushDate        time.Time
	FinalDeleteDate time.Time
}

type Task struct {
	TaskID   string
	Title    string
	Pusher   string
	Content  string
	Status   bool
	PushDate time.Time
	DeadLine time.Time
	Urgency  int8
}

type TencentRes struct {
	Openid      string
	Session_key string
	Unionid     string
	Errcode     int
	Errmsg      string
}

type TaskNode struct {
	Task  Task
	Self  int
	Child []int
}

type TaskNodeInDB struct {
	TaskID string
	Self   int
	Child  string
}