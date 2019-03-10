package utils

func CheckErr(err error) {
	if err != nil {
		RecordError(err)
		panic(err)
	}
}

func HasErr(err error) bool {
	if err != nil {
		return true
	} else {
		return false
	}
}
