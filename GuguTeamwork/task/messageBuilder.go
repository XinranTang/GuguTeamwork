package task

import (
	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
	"strconv"
	"time"
)

func BuildMessage(Title string, Pusher string, Content string, NotRead string, FinalDeleteDate string) (*utils.Message, error) {
	var message utils.Message
	db := sqlmanip.ConnetUserDB()
	num, err := sqlmanip.CountMessage(db, Pusher)
	if err != nil {
		return nil, err
	}
	sqlmanip.DisConnectDB(db)
	message.MessageID = Pusher + "_message_" + strconv.Itoa(num+1)
	message.Title = Title
	message.Pusher = Pusher
	message.Content = Content
	message.NotRead = NotRead
	message.Read = ""
	message.PushDate = time.Now().UTC()
	if FinalDeleteDate != "" {
		message.FinalDeleteDate, err = time.Parse("2006-01-02T15:04:05Z", FinalDeleteDate)
		if err != nil {
			return nil, err
		}
	} else {
		message.FinalDeleteDate = time.Now().AddDate(0, 0, 3).UTC()
	}

	return &message, nil
}
