package tree

import (
	"GuguTeamwork/utils"
	"sync"
	"time"
)

var forest *Forest

const forestFlushDuration = time.Second * 15

type monitor struct {
	Timer     *time.Timer
	UpdateSig bool
}

type Forest struct {
	Projects map[string][]utils.TaskNode
	Monitors map[string]monitor
	PRMMutex sync.RWMutex
	MRMMutex sync.RWMutex
}

func BuildForest() {
	forest = new(Forest)
}

func GetForest() *Forest {
	return forest
}

func BuildMonitor() monitor {
	return monitor{
		Timer:     time.NewTimer(forestFlushDuration),
		UpdateSig: false,
	}
}

func (f *Forest) InitForest() {
	f.Projects = make(map[string][]utils.TaskNode)
	f.Monitors = make(map[string]monitor)
}
