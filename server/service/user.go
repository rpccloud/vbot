package service

import "github.com/rpccloud/rpc"

var UserService = rpc.NewService().
	On("create", userCreate).
	On("login", userLogin)

func userCreate(rt rpc.Runtime, name string, password string) rpc.Return {
	return rt.Reply(false)
}

func userLogin(rt rpc.Runtime, name string, password string) rpc.Return {
	return rt.Reply(false)
}
