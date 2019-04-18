package tree

import (
	"sync"
	"time"

	"GuguTeamwork/utils"
)

var forest *Forest

//在这个时间后树将从内存中摘掉
const forestFlushDuration = time.Second * 30

type monitor struct {
	Timer     *time.Timer
	UpdateSig bool
}

type Forest struct {
	Projects map[string][]utils.TaskNode
	Monitors map[string]*monitor
	Opes     *utils.Queue
	PRMMutex sync.RWMutex
	MRMMutex sync.RWMutex
	ORMMutex sync.RWMutex
}

func BuildForest() {
	forest = new(Forest)
}

func GetForest() *Forest {
	return forest
}

func BuildMonitor() *monitor {
	return &monitor{
		Timer:     time.NewTimer(forestFlushDuration),
		UpdateSig: false,
	}
}

func BuildOpe(treeid string, taskid string, manip int8) *utils.Ope {
	return &utils.Ope{
		TreeID:       treeid,
		TaskID:       taskid,
		Manip:        manip,
		DeleteMember: nil,
	}
}
func BuildDeleteOpe(treeid string, taskid string, manip int8, members []string) *utils.Ope {
	return &utils.Ope{
		TreeID:       treeid,
		TaskID:       taskid,
		Manip:        manip,
		DeleteMember: members,
	}
}

func (f *Forest) InitForest() {
	f.Projects = make(map[string][]utils.TaskNode)
	f.Monitors = make(map[string]*monitor)
	f.Opes = utils.NewQueue()
}
