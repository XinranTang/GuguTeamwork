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

type PrivateInfo struct {
	ID       string
	Name     string
	Sign     string
	Sex      int8
	Phone    string
	Mail     string
	Position string
	Ability  string
}

//format of Read and Not Read
//e.g. testopenid1;testopenid2;
type Message struct {
	MessageID       string
	Title           string
	Pusher          string
	Content         string
	Read            string
	NotRead         string
	PushDate        time.Time
	FinalDeleteDate time.Time
}

type Task struct {
	TaskID   string
	Title    string
	Pusher   string
	Content  string
	Status   int8
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
	Task      Task
	Self      int
	Child     []int
	TeamMates []string
}

type TaskNodeInDB struct {
	TaskID string
	Self   int
	Child  string
}

type Ope struct {
	TreeID       string
	TaskID       string
	Manip        int8
	DeleteMember []string
}
