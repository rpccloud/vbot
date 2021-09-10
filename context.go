package vbot

import (
	"path/filepath"

	"rogchap.com/v8go"
)

type Context struct {
	parent *Context
	vm     *v8go.Isolate
	v8Ctx  *v8go.Context
	file   string
}

func NewRootContext(file string) *Context {
	if absFile, e := filepath.Abs(file); e != nil {
		panic(e)
	} else if vm, e := v8go.NewIsolate(); e != nil {
		panic(e)
	} else if v8Ctx, e := v8go.NewContext(vm); e != nil {
		panic(e)
	} else {
		return &Context{
			parent: nil,
			vm:     vm,
			v8Ctx:  v8Ctx,
			file:   absFile,
		}
	}
}


