package service

import (
	"bytes"
	"fmt"

	"github.com/boltdb/bolt"
	"github.com/rpccloud/rpc"
	"github.com/rpccloud/vbot/server/core"
)

var ServerService = rpc.NewService(nil).
	On("Create", createServer).
	On("List", listServers)

func dbCreateServer(
	db *core.DB, bucket string,
	id string, sshName string, sshUser string, sshPort string, sshAddr string, sshComment string,
) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucket))

		if e := b.Put(core.DBKey("servers.%s", id), []byte(id)); e != nil {
			return e
		} else if e := b.Put(core.DBKey("ssh.%s.name", id), []byte(sshName)); e != nil {
			return e
		} else if e := b.Put(core.DBKey("ssh.%s.user", id), []byte(sshUser)); e != nil {
			return e
		} else if e = b.Put(core.DBKey("ssh.%s.port", id), []byte(sshPort)); e != nil {
			return e
		} else if e = b.Put(core.DBKey("ssh.%s.addr", id), []byte(sshAddr)); e != nil {
			return e
		} else if e = b.Put(core.DBKey("ssh.%s.comment", id), []byte(sshComment)); e != nil {
			return e
		} else {
			return nil
		}
	})
}

func createServer(
	rt rpc.Runtime, sessionID string,
	sshName string, sshUser string, sshPort string, sshAddr string, sshComment string,
) rpc.Return {
	if userName, e := rt.Call("#.user:getNameBySessionID", sessionID).ToString(); e != nil {
		return rt.Reply(e)
	} else if db, e := core.GetManager().GetDB(core.GetConfig().GetDBFile()); e != nil {
		return rt.Reply(e)
	} else if id, e := db.GetBucketID("-" + userName); e != nil {
		return rt.Reply(e)
	} else if e = dbCreateServer(db, "-"+userName, fmt.Sprintf("%d", id), sshName, sshUser, sshPort, sshAddr, sshComment); e != nil {
		return rt.Reply(e)
	} else {
		return rt.Reply(true)
	}
}

func dbListServers(db *core.DB, bucket string, detail bool) (rpc.Array, error) {
	ret := rpc.Array{}
	return ret, db.View(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		if b == nil {
			return fmt.Errorf("bucket \"%s\" not exist", bucket)
		}

		c := b.Cursor()
		p := []byte("servers.")
		for k, v := c.Seek(p); k != nil && bytes.HasPrefix(k, p); k, v = c.Next() {
			id := string(v)
			if !detail {
				ret = append(ret, rpc.Map{
					"id":   id,
					"name": string(b.Get(core.DBKey("ssh.%s.name", id))),
				})
			} else {
				ret = append(ret, rpc.Map{
					"id":      id,
					"name":    string(b.Get(core.DBKey("ssh.%s.name", id))),
					"user":    string(b.Get(core.DBKey("ssh.%s.user", id))),
					"port":    string(b.Get(core.DBKey("ssh.%s.port", id))),
					"addr":    string(b.Get(core.DBKey("ssh.%s.addr", id))),
					"comment": string(b.Get(core.DBKey("ssh.%s.comment", id))),
				})
			}
		}

		return nil
	})
}

func listServers(rt rpc.Runtime, sessionID string, detail bool) rpc.Return {
	if userName, e := rt.Call("#.user:getNameBySessionID", sessionID).ToString(); e != nil {
		return rt.Reply(e)
	} else if db, e := core.GetManager().GetDB(core.GetConfig().GetDBFile()); e != nil {
		return rt.Reply(e)
	} else if ret, e := dbListServers(db, "-"+userName, detail); e != nil {
		return rt.Reply(e)
	} else {
		return rt.Reply(ret)
	}
}

// func createServer(rt rpc.Runtime, user string, port string, addr string, comment string) rpc.Return {
// 	if db, e := core.GetManager().GetDB(core.GetConfig().GetDBFile()); e != nil {
// 		return rt.Reply(e)
// 	} else if id, e := db.GetBucketID("user"); e != nil {
// 		return rt.Reply(e)
// 	} else if e = dbCreateServer(db, fmt.Sprintf("%d", id), user, port, addr, comment); e != nil {
// 		return rt.Reply(e)
// 	} else {
// 		return rt.Reply(true)
// 	}
// }
