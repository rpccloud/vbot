package main

import (
	"github.com/rpccloud/rpc"
	"github.com/rpccloud/vbot/server/service"
)

func main() {
	serverConfig := rpc.GetDefaultServerConfig().
		SetNumOfThreads(4096)
	rpc.NewServer(serverConfig).
		AddService("user", service.UserService, rpc.Map{"manager": service.NewUserManager()}).
		Listen("ws", "0.0.0.0:8080", nil).
		Open()
}
