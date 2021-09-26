package core

import (
	"path/filepath"

	"rogchap.com/v8go"
)

type Context struct {
	parent *Context
	vm     *v8go.Isolate
	v8Ctx  *v8go.Context
	file   string
	logCH  chan *LogItem
}

func NewRootContext(file string) (*Context, error) {
	if absFile, e := filepath.Abs(file); e != nil {
		return nil, e
	} else if vm, e := v8go.NewIsolate(); e != nil {
		return nil, e
	} else if v8Ctx, e := v8go.NewContext(vm); e != nil {
		return nil, e
	} else {
		return &Context{
			parent: nil,
			vm:     vm,
			v8Ctx:  v8Ctx,
			file:   absFile,
			logCH:  make(chan *LogItem, 1024000),
		}, nil
	}
}

func (p *Context) GetLogItem() *LogItem {
	return <-p.logCH
}

func (p *Context) Report(kind LogKind, data []byte) bool {
	logItem := &LogItem{
		kind: kind,
		data: data,
	}

	select {
	case p.logCH <- logItem:
		return true
	default:
		return false
	}
}
