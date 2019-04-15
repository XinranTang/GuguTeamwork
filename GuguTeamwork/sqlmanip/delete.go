package sqlmanip

import (
	_ "github.com/mattn/go-sqlite3"
)

//从数据库中删除一张树表
func DropTree(treeid string) error {
	db := ConnectTaskDB()
	defer DisConnectDB(db)

	stmt, err := db.Prepare("DROP table ?")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(treeid)
	if err != nil {
		return err
	}
	return nil
}
