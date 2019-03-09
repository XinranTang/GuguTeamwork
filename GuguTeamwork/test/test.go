package test

import (
	"net/http"

	"GuguTeamwork/utils"
)

func Test(w http.ResponseWriter, r *http.Request) {
	logger := utils.Logger()
	(*logger).Println("Logger work properly in test")
	w.Write([]byte("Test."))
}
