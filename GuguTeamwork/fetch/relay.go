package fetch

import (
	"io/ioutil"
	"net/http"

	"GuguTeamwork/utils"
)

func MakeQR(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadAll(r.Body)
	utils.CheckErr(err, "MakeInvitation:read data")
	r.Body.Close()

	res := utils.GetInvitation(data)
	w.Write(res)
}
