package core

import "time"

var gConfig = newConfig()

func GetConfig() *Config {
	return gConfig
}

type Config struct {
	dbFile         string
	sessionTimeout time.Duration
}

func newConfig() *Config {
	return &Config{
		dbFile:         "./vbot.db",
		sessionTimeout: 120 * time.Second,
	}
}

func (p *Config) GetDBFile() string {
	return p.dbFile
}

func (p *Config) SetDBFile(dbFile string) {
	p.dbFile = dbFile
}

func (p *Config) GetSessionTimeout() time.Duration {
	return p.sessionTimeout
}

func (p *Config) SetSessionTimeout(sessionTimeout time.Duration) {
	p.sessionTimeout = sessionTimeout
}
