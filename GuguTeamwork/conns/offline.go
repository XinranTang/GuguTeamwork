package conns

import (
	"net/http"
)

//务必在每次切出程序时调用
func Offline(w http.ResponseWriter, r *http.Request) {
	conn := pool.GetConn(r.PostFormValue("OpenId"))
	if conn != nil {
		conn <- ShutDownNotice
	}
}
