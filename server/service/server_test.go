package service

import (
	"fmt"
	"testing"
	"time"

	"github.com/rpccloud/assert"
	"github.com/rpccloud/rpc"
	"github.com/rpccloud/vbot/server/core"
)

func TestDebug(t *testing.T) {
	t.Run("ok", func(t *testing.T) {
		assert := assert.New(t)
		client := rpc.NewClient("ws", "127.0.0.1:8080", "rpc", nil, 1024, 1024, nil)
		userRet, err := client.Send(5*time.Second, "#.user:Login", "admin", "Test123456")
		assert(err).IsNil()
		user, ok := userRet.(rpc.Map)
		assert(ok).IsTrue()
		assert(user["name"]).Equals("admin")

		// sessionID string,
		// sshName string, sshUser string, sshPort string, sshAddr string, sshComment string,
		rand, _ := core.GetRandString(10)
		_, _ = client.Send(
			5*time.Second,
			"#.server:Create",
			user["sessionID"],
			"host"+rand,
			"22",
			"user"+rand,
			"password",
			"name"+rand,
			"sshComment",
			false,
		)
		listRet, err := client.Send(5*time.Second, "#.server:List", user["sessionID"], false)
		fmt.Println(listRet, err)
	})

}
