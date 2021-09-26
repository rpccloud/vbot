package core

import (
	"time"

	"github.com/boltdb/bolt"
)

type DB struct {
	db *bolt.DB
}

func NewDB(file string) (*DB, error) {
	db, e := bolt.Open(file, 0600, &bolt.Options{Timeout: 2 * time.Second})
	if e != nil {
		return nil, e
	}

	return &DB{db: db}, nil
}
