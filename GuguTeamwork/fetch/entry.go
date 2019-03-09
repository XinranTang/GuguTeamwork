package fetch

import (
	"net/http"

	"GuguTeamwork/utils"
)

func Entry(w http.ResponseWriter, r *http.Request) {
	logger := utils.Logger()
	r.PostFormValue("openid")
}
