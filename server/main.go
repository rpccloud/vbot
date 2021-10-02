package main

import (
	"github.com/rpccloud/rpc"
	"github.com/rpccloud/vbot/server/service"
)

func main() {
	staticFileMap := map[string]string{"/": "./web"}
	serverConfig := rpc.GetDefaultServerConfig().
		SetNumOfThreads(4096)
	rpc.NewServer(serverConfig).
		AddService("user", service.UserService, nil).
		Listen("ws", "0.0.0.0:8080", "/rpc", nil, staticFileMap).
		Open()
}
