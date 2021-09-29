package service

import (
	"errors"
	"fmt"
	"regexp"
	"sync"
	"time"

	"github.com/boltdb/bolt"
	"github.com/rpccloud/rpc"
	"github.com/rpccloud/vbot/server/core"
)

var (
	userNameRegex = regexp.MustCompile(`^[_0-9a-zA-Z]+$`)
)

type User struct {
	name       string
	sessionID  string
	activeTime time.Time
}

func NewUser(name string, sessionID string) *User {
	return &User{
		name:       name,
		sessionID:  sessionID,
		activeTime: time.Now(),
	}
}

func (p *User) ToMap() rpc.Map {
	return rpc.Map{
		"name":      p.name,
		"sessionID": p.sessionID,
	}
}

type UserManager struct {
	sessionMap map[string]*User
	mu         sync.Mutex
}

func NewUserManager() *UserManager {
	return &UserManager{
		sessionMap: make(map[string]*User),
	}
}

func (p *UserManager) AddUser(user *User) {
	p.mu.Lock()
	defer p.mu.Unlock()

	p.sessionMap[user.sessionID] = user
}

func (p *UserManager) OnTimer(timeout time.Duration) {
	p.mu.Lock()
	defer p.mu.Unlock()

	now := time.Now()
	for key, user := range p.sessionMap {
		if now.Sub(user.activeTime) > timeout {
			delete(p.sessionMap, key)
		}
	}
}

var UserService = rpc.NewService().
	On("$onTimer", onTimer).
	On("create", userCreate).
	On("login", userLogin)

func onTimer(rt rpc.Runtime, seq uint64) rpc.Return {
	if seq%10 == 0 {
		if configMgr, ok := rt.GetServiceConfig("manager"); !ok {
			return rt.Reply(errors.New("user service config error"))
		} else if manager, ok := configMgr.(*UserManager); !ok {
			return rt.Reply(errors.New("user service config error"))
		} else {
			manager.OnTimer(core.GetConfig().GetSessionTimeout())
		}
	}

	return rt.Reply(nil)
}

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
	if configMgr, ok := rt.GetServiceConfig("manager"); !ok {
		return rt.Reply(errors.New("user service config error"))
	} else if manager, ok := configMgr.(*UserManager); !ok {
		return rt.Reply(errors.New("user service config error"))
	} else if !userNameRegex.MatchString(name) {
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
	} else if sessionID, e := core.GetRandString(32); e != nil {
		return rt.Reply(e)
	} else {
		user := NewUser(name, sessionID)
		manager.AddUser(user)
		return rt.Reply(user.ToMap())
	}
}
