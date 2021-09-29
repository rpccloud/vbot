package core

var gConfig = newConfig()

func GetConfig() *Config {
	return gConfig
}

type Config struct {
	dbFile string
}

func newConfig() *Config {
	return &Config{
		dbFile: "./vbot.db",
	}
}

func (p *Config) SetDBFile(dbFile string) {
	p.dbFile = dbFile
}

func (p *Config) GetDBFile() string {
	return p.dbFile
}
