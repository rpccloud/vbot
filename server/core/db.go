package core

import (
	"bytes"
	"fmt"
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

func (p *DB) Put(bucketName string, key string, value []byte) error {
	return p.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return fmt.Errorf("bucket \"%s\" does not exist", bucketName)
		}
		return b.Put([]byte(key), value)
	})
}

func (p *DB) Get(bucketName string, key string) ([]byte, error) {
	ret := []byte(nil)
	return ret, p.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))

		if b == nil {
			return fmt.Errorf("bucket \"%s\" not exist", bucketName)
		}

		k, v := b.Cursor().Seek([]byte(key))

		if string(k) != key {
			return fmt.Errorf(
				"the key \"%s\" in bucket \"%s\" does not exist",
				key,
				bucketName,
			)
		}

		ret = make([]byte, len(v))
		copy(ret, v)
		return nil
	})
}

func (p *DB) Search(bucketName string, prefix string) (map[string][]byte, error) {
	ret := make(map[string][]byte)
	return ret, p.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))

		if b == nil {
			return fmt.Errorf("bucket \"%s\" not exist", bucketName)
		}

		c := b.Cursor()
		p := []byte(prefix)
		for k, v := c.Seek(p); k != nil && bytes.HasPrefix(k, p); k, v = c.Next() {
			buf := make([]byte, len(v))
			copy(buf, v)
			ret[string(k)] = buf
		}
		return nil
	})
}

func (p *DB) GetBucketID(bucketName string) (uint64, error) {
	ret := uint64(0)
	return ret, p.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return fmt.Errorf("bucket \"%s\" not exist", bucketName)
		}

		id, e := b.NextSequence()
		if e != nil {
			return e
		}

		ret = id
		return nil
	})
}
