package utils

import (
	"strings"
)

func DealWithOpenId(openid string) string {
	return strings.Replace(openid, "-", "_", -1)
}
