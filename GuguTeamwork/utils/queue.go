package utils

import (
	"container/list"
)

type Queue struct {
	body     *list.List
	tailElem *list.Element
}

func NewQueue() *Queue {
	return &Queue{
		body:     list.New(),
		tailElem: nil,
	}
}

func (q *Queue) Push(item interface{}) {
	q.tailElem = q.body.PushBack(item)
}

func (q *Queue) PoP() interface{} {
	t1 := q.tailElem
	q.tailElem = q.tailElem.Prev()
	t2 := t1.Value
	q.body.Remove(t1)
	return t2
}

func (q *Queue) IsEmp() bool {
	if q.tailElem == nil {
		return true
	}
	return false
}
