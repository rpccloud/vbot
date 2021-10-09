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
	On("List", listServers).
	On("Delete", deleteServer)

func dbCreateServer(
	db *core.DB, bucket string, id string,
	host string, port string, user string, password string, privateKey string, name string, comment string,
) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		if e := b.Put(core.DBKey("servers.%s", id), []byte(id)); e != nil {
			return e
		} else if e = b.Put(core.DBKey("ssh.%s.host", id), []byte(host)); e != nil {
			return e
		} else if e = b.Put(core.DBKey("ssh.%s.port", id), []byte(port)); e != nil {
			return e
		} else if e := b.Put(core.DBKey("ssh.%s.user", id), []byte(user)); e != nil {
			return e
		} else if e = b.Put(core.DBKey("ssh.%s.password", id), []byte(password)); e != nil {
			return e
		} else if e = b.Put(core.DBKey("ssh.%s.privateKey", id), []byte(privateKey)); e != nil {
			return e
		} else if e := b.Put(core.DBKey("ssh.%s.name", id), []byte(name)); e != nil {
			return e
		} else if e = b.Put(core.DBKey("ssh.%s.comment", id), []byte(comment)); e != nil {
			return e
		} else {
			return nil
		}
	})
}

func createServer(
	rt rpc.Runtime, sessionID string,
	host string, port string, user string, password string, name string, comment string, auto bool,
) rpc.Return {
	if name == "" {
		name = fmt.Sprintf("%s@%s", user, host)
	}

	if userName, e := rt.Call("#.user:getNameBySessionID", sessionID).ToString(); e != nil {
		return rt.Reply(e)
	} else if db, e := core.GetManager().GetDB(core.GetConfig().GetDBFile()); e != nil {
		return rt.Reply(e)
	} else if id, e := db.GetBucketID("-" + userName); e != nil {
		return rt.Reply(e)
	} else if e = dbCreateServer(db, "-"+userName, fmt.Sprintf("%d", id), host, port, user, password, "", name, comment); e != nil {
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
					"user": string(b.Get(core.DBKey("ssh.%s.user", id))),
					"port": string(b.Get(core.DBKey("ssh.%s.port", id))),
					"host": string(b.Get(core.DBKey("ssh.%s.host", id))),
					"auto": string(b.Get(core.DBKey("ssh.%s.privateKey", id))) != "",
				})
			} else {
				ret = append(ret, rpc.Map{
					"id":      id,
					"name":    string(b.Get(core.DBKey("ssh.%s.name", id))),
					"user":    string(b.Get(core.DBKey("ssh.%s.user", id))),
					"port":    string(b.Get(core.DBKey("ssh.%s.port", id))),
					"host":    string(b.Get(core.DBKey("ssh.%s.host", id))),
					"auto":    string(b.Get(core.DBKey("ssh.%s.privateKey", id))) != "",
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

func dbDeleteServer(db *core.DB, bucket string, id string) error {
	return db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucket))
		if b == nil {
			return fmt.Errorf("bucket \"%s\" not exist", bucket)
		}

		c := b.Cursor()
		p := core.DBKey("ssh.%s", id)
		for k, _ := c.Seek(p); k != nil && bytes.HasPrefix(k, p); k, _ = c.Next() {
			fmt.Printf("delete %s\n", string(k))
			_ = b.Delete(k)
		}

		_ = b.Delete(core.DBKey("servers.%s", id))
		return nil
	})
}
func deleteServer(rt rpc.Runtime, sessionID string, serverID string) rpc.Return {
	if userName, e := rt.Call("#.user:getNameBySessionID", sessionID).ToString(); e != nil {
		return rt.Reply(e)
	} else if db, e := core.GetManager().GetDB(core.GetConfig().GetDBFile()); e != nil {
		return rt.Reply(e)
	} else if e := dbDeleteServer(db, "-"+userName, serverID); e != nil {
		return rt.Reply(e)
	} else {
		return rt.Reply(true)
	}
}
