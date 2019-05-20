package conns

import (
	"sync"
	"time"
)

var pool *connPool

type WsMsg struct {
	Timeout   time.Time
	TypeCode  int8
	Sender    string
	Receiver  string
	ContentId string
}

type connPool struct {
	conns map[string]chan WsMsg
	lock  sync.RWMutex
}

func InitConnPool() {
	pool = new(connPool)
	pool.conns = make(map[string]chan WsMsg)
}

func GetConnPool() *connPool {
	return pool
}

func (pool *connPool) AddConn(openid string, msgChan chan WsMsg) {
	pool.lock.Lock()
	{
		pool.conns[openid] = msgChan
	}
	pool.lock.Unlock()
}

func (pool *connPool) RemoveConn(openid string) {
	pool.lock.Lock()
	{
		delete(pool.conns, openid)
	}
	pool.lock.Unlock()
}

func (pool *connPool) GetConn(openid string) chan WsMsg {
	var ok bool
	var v chan WsMsg
	pool.lock.RLock()
	{
		v, ok = pool.conns[openid]
	}
	if ok {
		return v
	} else {
		return nil
	}
}
