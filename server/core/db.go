package core

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/boltdb/bolt"
)

var gManager = newDBManager()

func DBKey(format string, a ...interface{}) []byte {
	return []byte(fmt.Sprintf(format, a...))
}

func GetManager() *DBManager {
	return gManager
}

type DBManager struct {
	dbMap map[string]*DB
	mu    sync.Mutex
}

func newDBManager() *DBManager {
	return &DBManager{
		dbMap: make(map[string]*DB),
		mu:    sync.Mutex{},
	}
}

func (p *DBManager) GetDB(path string) (*DB, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	absPath, e := filepath.Abs(path)
	if e != nil {
		return nil, e
	}

	if v, ok := p.dbMap[absPath]; ok {
		return v, nil
	}

	e = os.MkdirAll(filepath.Dir(absPath), 0500)
	if e != nil {
		return nil, e
	}

	ret, e := NewDB(absPath)
	if ret != nil {
		p.dbMap[absPath] = ret
	}

	return ret, e
}

type DB struct {
	db *bolt.DB
	mu sync.Mutex
}

func NewDB(absPath string) (*DB, error) {
	db, e := bolt.Open(absPath, 0600, &bolt.Options{Timeout: 2 * time.Second})
	if e != nil {
		return nil, e
	}

	return &DB{db: db}, nil
}

func (p *DB) CreateBucketIsNotExist(name string) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	return p.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(name))

		if b != nil {
			return nil
		}

		_, e := tx.CreateBucket([]byte(name))
		return e
	})
}

func (p *DB) IsBucketExist(name string) bool {
	p.mu.Lock()
	defer p.mu.Unlock()

	ret := false
	_ = p.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(name))
		ret = (b != nil)
		return nil
	})
	return ret
}

func (p *DB) DeleteBucket(name string) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	return p.db.Update(func(tx *bolt.Tx) error {
		return tx.DeleteBucket([]byte(name))
	})
}

func (p *DB) Update(fn func(tx *bolt.Tx) error) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	return p.db.Update(func(tx *bolt.Tx) error {
		return fn(tx)
	})
}

func (p *DB) Put(bucketName string, key string, value []byte) error {
	p.mu.Lock()
	defer p.mu.Unlock()

	return p.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))
		if b == nil {
			return fmt.Errorf("bucket \"%s\" does not exist", bucketName)
		}
		return b.Put([]byte(key), value)
	})
}

func (p *DB) Get(bucketName string, key string) ([]byte, error) {
	p.mu.Lock()
	defer p.mu.Unlock()

	ret := []byte(nil)
	return ret, p.db.Update(func(tx *bolt.Tx) error {
		b := tx.Bucket([]byte(bucketName))

		if b == nil {
			return fmt.Errorf("bucket \"%s\" does not exist", bucketName)
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
	p.mu.Lock()
	defer p.mu.Unlock()

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
	p.mu.Lock()
	defer p.mu.Unlock()

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
