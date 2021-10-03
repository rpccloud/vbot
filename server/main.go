package main

import (
	"net/http"

	"embed"

	"github.com/rpccloud/rpc"
	"github.com/rpccloud/vbot/server/service"
)

//go:embed vbot/*
var RootFS embed.FS

type RootHandler struct{}

func (h *RootHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" {
		http.Redirect(w, r, "/vbot/index.html", http.StatusSeeOther)
	}
}

func main() {
	staticFileMap := map[string]http.Handler{
		"/":      &RootHandler{},
		"/vbot/": http.StripPrefix("/", http.FileServer(http.FS(RootFS))),
	}

	serverConfig := rpc.GetDefaultServerConfig().
		SetNumOfThreads(4096)
	rpc.NewServer(serverConfig).
		AddService("user", service.UserService, nil).
		Listen("ws", "0.0.0.0:8080", "/rpc", nil, staticFileMap).
		Open()
}
