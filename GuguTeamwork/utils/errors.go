package utils

import (
	"net/http"
)

type EmptyPostFormValueError struct {
	ErrMsg string
}

func (err *EmptyPostFormValueError) Error() string {
	err.ErrMsg = "This operation do not allowed empty post parametres."
	return err.ErrMsg
}

func (err *EmptyPostFormValueError) DealWithError(w http.ResponseWriter) {
	w.WriteHeader(403)
	w.Write([]byte(err.ErrMsg))
}

type TencentError struct {
	ErrMsg string
}

func (err *TencentError) Error() string {
	err.ErrMsg = "Tencent servers return error msg."
	return err.ErrMsg
}

func (err *TencentError) DealWithError(w http.ResponseWriter, r *TencentRes) {
	w.WriteHeader(403)
	w.Write([]byte(r.Errmsg))
}

type TreeManipError struct {
	ErrMsg string
}

func (err *TreeManipError) Error() string {
	err.ErrMsg = "Invalid openration on tree."
	return err.ErrMsg
}

type OtherError struct {
	ErrMsg string
}

func (err *OtherError) Error() string {
	err.ErrMsg = "Simply not right"
	return err.ErrMsg
}
