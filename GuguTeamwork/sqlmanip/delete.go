package sqlmanip

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

//从数据库中删除一张树表
func DropTree(db *sql.DB, treeid string) error {
	order := "DROP table " + treeid + ";"
	stmt, err := db.Prepare(order)
	if err != nil {
		return err
	}
	_, err = stmt.Exec()
	if err != nil {
		return err
	}
	return nil
}

func DeleteFromDB(db *sql.DB, table string, key string, value string) error {
	order := "DELETE FROM " + table + " WHERE " + key + "=?"
	stmt, err := db.Prepare(order)
	if err != nil {
		return err
	}
	_, err = stmt.Exec(value)
	if err != nil {
		return err
	}
	return nil
}
