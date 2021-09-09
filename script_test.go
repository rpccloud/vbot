package vbot

import (
	"fmt"
	"testing"

	"rogchap.com/v8go"
)

func TestDebug(t *testing.T) {
	ctx, _ := v8go.NewContext()                             // creates a new V8 context with a new Isolate aka VM
	ctx.RunScript("const add = (a, b) => a + b", "math.js") // executes a script on the global context
	ctx.RunScript("const result = add(3, 4)", "main.js")    // any functions previously added to the context can be called
	val, _ := ctx.RunScript("result", "value.js")           // return a value in JavaScript back to Go
	fmt.Printf("addition result: %s\n", val)
}
