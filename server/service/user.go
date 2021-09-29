package service

import (
	"fmt"
	"regexp"

	"github.com/boltdb/bolt"
	"github.com/rpccloud/rpc"
	"github.com/rpccloud/vbot/server/core"
)

var (
	userNameRegex = regexp.MustCompile(`^[_0-9a-zA-Z]+$`)
)

var UserService = rpc.NewService().
	On("create", userCreate).
	On("login", userLogin)

func userCreate(rt rpc.Runtime, name string, password string) rpc.Return {
	fnUpdate := func(db *core.DB, enOK []byte, enSecret []byte) error {
		return db.Update(func(tx *bolt.Tx) error {
			b := tx.Bucket([]byte("auth"))
			if e := b.Put(core.DBKey("user.%s.ok", name), enOK); e != nil {
				return e
			} else if e = b.Put(core.DBKey("user.%s.secret", name), enSecret); e != nil {
				return e
			} else if e = b.Put(core.DBKey("system.user.%s", name), []byte{1}); e != nil {
				return e
			} else {
				return nil
			}
		})
	}

	if !userNameRegex.MatchString(name) {
		return rt.Reply(fmt.Errorf("invalid user name \"%s\"", name))
	} else if secret, e := core.GetRandString(100); e != nil {
		return rt.Reply(e)
	} else if enOK, e := core.Encrypt([]byte(secret), []byte("OK")); e != nil {
		return rt.Reply(e)
	} else if enSecret, e := core.Encrypt([]byte(password), []byte(secret)); e != nil {
		return rt.Reply(e)
	} else if db, e := core.GetManager().GetDB(core.GetConfig().GetDBFile()); e != nil {
		return rt.Reply(e)
	} else if e = db.CreateBucketIsNotExist("auth"); e != nil {
		return rt.Reply(e)
	} else if e = db.CreateBucketIsNotExist("user"); e != nil {
		return rt.Reply(e)
	} else if e = db.CreateBucketIsNotExist("template"); e != nil {
		return rt.Reply(e)
	} else if e = fnUpdate(db, enOK, enSecret); e != nil {
		return rt.Reply(e)
	} else {
		return rt.Reply(true)
	}
}

func userLogin(rt rpc.Runtime, name string, password string) rpc.Return {
	if !userNameRegex.MatchString(name) {
		return rt.Reply(fmt.Errorf("invalid user name \"%s\"", name))
	} else if db, e := core.GetManager().GetDB(core.GetConfig().GetDBFile()); e != nil {
		return rt.Reply(e)
	} else if enSecret, e := db.Get("auth", fmt.Sprintf("user.%s.secret", name)); e != nil {
		return rt.Reply(e)
	} else if enOK, e := db.Get("auth", fmt.Sprintf("user.%s.ok", name)); e != nil {
		return rt.Reply(e)
	} else if secret, e := core.Decrypt([]byte(password), enSecret); e != nil {
		return rt.Reply(e)
	} else if ok, e := core.Decrypt([]byte(secret), enOK); e != nil {
		return rt.Reply(e)
	} else if string(ok) != "OK" {
		return rt.Reply(fmt.Errorf("internal error"))
	} else {
		return rt.Reply(true)
	}
}
