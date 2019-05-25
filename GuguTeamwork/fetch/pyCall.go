package fetch

import (
	"net/http"
	"os/exec"

	"GuguTeamwork/utils"
)

//使用get方法传参
func Analysis(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	if r.Form["flag"][0] == "1" {
		_, err := exec.LookPath("./personal.py " + r.Form["OpenId"][0])
		utils.CheckErr(err, "Analysis:personal")
	} else if r.Form["flag"][0] == "2" {
		_, err := exec.LookPath("./group.py " + r.Form["OpenId"][0])
		utils.CheckErr(err, "Analysis:group")
	} else {
		w.WriteHeader(403)
		return
	}
}

func Make(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	if r.Form["flag"][0] == "1" {
		_, err := exec.LookPath("./resume.py " + r.Form["OpenId"][0])
		utils.CheckErr(err, "Make:resume")
	} else if r.Form["flag"][0] == "2" {
		_, err := exec.LookPath("./IDCard.py " + r.Form["OpenId"][0])
		utils.CheckErr(err, "Make:IDCard")
	} else {
		w.WriteHeader(403)
		return
	}
}
