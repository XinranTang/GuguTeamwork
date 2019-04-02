package utils

import (
	"strconv"
)

func ParseTaskNodeInDBChild(Childs string) []int {
	var head = 0
	var tail = find(Childs, ";", head)
	var res []int
	for {
		if tail != -1 {
			child, err := strconv.Atoi(Childs[head:tail])
			CheckErr(err, "ParseTaskNodeInDBChild:strconv")
			res = append(res, child)
			head = tail + 1
			tail = find(Childs, ";", head)
		} else {
			break
		}
	}
	return res
}

func ParseManage(manage string) []string {
	var head = 0
	var tail = find(manage, ";", head)
	var res []string
	for {
		if tail != -1 {
			res = append(res, manage[head:tail])
			head = tail + 1
			tail = find(manage, ";", head)
		} else {
			break
		}
	}
	return res
}

func find(str string, substr string, from int) int {
	var mainSize = len([]rune(str))
	var subSize = len([]rune(substr))
	var flag bool
	for i := from; i < mainSize-subSize+1; i++ {
		flag = true
		k := 0
		for j := i; j < subSize+i; j++ {
			if str[j] != substr[k] {
				flag = false
				break
			}
			k++
		}
		if flag {
			return i
		}
	}
	return -1
}
