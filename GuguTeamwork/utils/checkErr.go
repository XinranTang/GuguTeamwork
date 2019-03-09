package utils

func CheckErr(err error) {
	if err != nil {
		RecordError(err)
		panic(err)
	}
}
