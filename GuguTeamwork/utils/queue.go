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
	if q.tailElem == nil {
		q.tailElem = q.body.PushFront(item)
	} else {
		q.body.PushFront(item)
	}
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

func (q *Queue) SetOff(ope *Ope) (int8, error) {
	if ope.Manip == -1 {
		for v := q.body.Front(); v != nil; v = v.Next() {
			value, ok := v.Value.(*Ope)
			if !ok {
				return -1, new(OtherError)
			}
			if value.TreeID == ope.TreeID && value.TaskID == ope.TaskID {
				if v == q.tailElem {
					q.tailElem = q.tailElem.Prev()
				}
				q.body.Remove(v)
				if value.Manip == 0 {
					return 1, nil
				} else {
					return 2, nil
				}
			}
		}
	}
	return 0, nil
}
