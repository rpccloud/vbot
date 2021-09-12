package vbot

import (
	"os"
	"testing"

	"github.com/rpccloud/assert"
)

func TestNewDB(t *testing.T) {
	t.Run("test ok", func(t *testing.T) {
		assert := assert.New(t)
		db, e := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		assert(db).IsNotNil()
		assert(e).IsNil()
	})
}
