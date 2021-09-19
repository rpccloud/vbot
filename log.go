package vbot

type LogKind int

const (
	LogKindInfo LogKind = iota
	LogKindOut
	LogKindError
	LogKindFatal
)

type LogItem struct {
	kind LogKind
	data []byte
}
