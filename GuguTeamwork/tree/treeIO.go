package tree

import (
	"GuguTeamwork/sqlmanip"
	"GuguTeamwork/utils"
	"log"
)

func readForest(f *Forest) {
	db := sqlmanip.ConnectTaskDB()
	defer sqlmanip.DisConnectDB(db)
	trees := sqlmanip.QueryTrees(db)

	var nodes []utils.TaskNodeInDB
	for _, v := range trees {
		nodes = sqlmanip.QueryTaskNode(db, v)
		log.Println(nodes)
		//buildTree(nodes)
	}
}

/*func buildTree([]string) *utils.TaskNode{

}*/
