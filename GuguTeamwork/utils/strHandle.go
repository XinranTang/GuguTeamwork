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

func CheckEmp(strs ...string) bool {
	for _, v := range strs {
		if len(v) == 0 {
			return false
		}
	}
	return true
}

func QuickMerge(ss []string) []string {
	if len(ss) < 1024 {
		return loopMerge(ss)
	} else {
		return mapMerge(ss)
	}
}

func loopMerge(ss []string) []string {
	res := []string{}
	for _, i := range ss {
		flag := true
		for _, j := range res {
			if i == j {
				flag = false
				break
			}
		}
		if flag {
			res = append(res, i)
		}
	}
	return res
}

func mapMerge(ss []string) []string {
	res := []string{}
	tmpMap := make(map[string]byte)
	for _, i := range ss {
		l := len(tmpMap)
		tmpMap[i] = 0
		if len(tmpMap) != l {
			res = append(res, i)
		}
	}
	return res
}
