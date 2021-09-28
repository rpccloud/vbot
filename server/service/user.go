package service

import (
	"time"

	"github.com/rpccloud/rpc"
)

var UserService = rpc.NewService().
	On("create", userCreate).
	On("login", userLogin)

func userCreate(rt rpc.Runtime, name string, password string) rpc.Return {
	time.Sleep(time.Second)
	return rt.Reply(true)
}

func userLogin(rt rpc.Runtime, name string, password string) rpc.Return {
	return rt.Reply(false)
}
