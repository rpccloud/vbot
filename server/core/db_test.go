package core

import (
	"errors"
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

func TestDB_CreateBucket(t *testing.T) {
	t.Run("test ok", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		assert(db.CreateBucket("test")).IsNil()
		assert(db.IsBucketExist("test")).IsTrue()
	})

	t.Run("db exists", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.CreateBucket("test")
		assert(db.CreateBucket("test")).
			Equals(errors.New("bucket already exists"))
	})
}

func TestDB_IsBucketExist(t *testing.T) {
	t.Run("db exists", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		assert(db.CreateBucket("test")).IsNil()
		assert(db.IsBucketExist("test")).IsTrue()
	})

	t.Run("db does not exist", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		assert(db.IsBucketExist("test")).IsFalse()
	})
}

func TestDB_DeleteBucket(t *testing.T) {
	t.Run("db exists", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.CreateBucket("test")
		assert(db.DeleteBucket("test")).IsNil()
	})

	t.Run("db does not exist", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		assert(db.DeleteBucket("test")).Equals(errors.New("bucket not found"))
	})
}

func TestDB_Put(t *testing.T) {
	t.Run("test ok", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.CreateBucket("test")
		assert(db.Put("test", "key", []byte("hello"))).Equals(nil)
		assert(db.Get("test", "key")).Equals([]byte("hello"), nil)
	})

	t.Run("bucket does not exist", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		assert(db.Put("test", "key", []byte("hello"))).
			Equals(errors.New("bucket \"test\" does not exist"))
	})
}

func TestDB_Get(t *testing.T) {
	t.Run("bucket does not exist", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.Put("test", "key", []byte("hello"))
		assert(db.Get("test", "key")).
			Equals(nil, errors.New("bucket \"test\" does not exist"))
	})

	t.Run("bucket key does not exist", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.CreateBucket("test")
		_ = db.Put("test", "a", []byte("hello"))
		_ = db.Put("test", "b", []byte("hello"))
		_ = db.Put("test", "c", []byte("hello"))
		assert(db.Get("test", "bb")).Equals(
			nil,
			errors.New("the key \"bb\" in bucket \"test\" does not exist"),
		)
	})

	t.Run("test ok", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.CreateBucket("test")
		_ = db.Put("test", "key", []byte("hello"))
		assert(db.Get("test", "key")).Equals([]byte("hello"), nil)
	})
}

func TestDB_Search(t *testing.T) {
	t.Run("bucket does not exist", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		assert(db.Search("test", "a.")).
			Equals(map[string][]byte{}, errors.New("bucket \"test\" not exist"))
	})

	t.Run("test ok (no matches)", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.CreateBucket("test")
		_ = db.Put("test", "a.1", []byte("hello"))
		_ = db.Put("test", "a.2", []byte("hello"))
		_ = db.Put("test", "a.3", []byte("hello"))
		assert(db.Search("test", "a-")).Equals(map[string][]byte{}, nil)
	})

	t.Run("test ok", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.CreateBucket("test")
		_ = db.Put("test", "a.1", []byte("hello"))
		_ = db.Put("test", "a.2", []byte("hello"))
		_ = db.Put("test", "a.3", []byte("hello"))
		assert(db.Search("test", "a.")).Equals(map[string][]byte{
			"a.1": []byte("hello"),
			"a.2": []byte("hello"),
			"a.3": []byte("hello"),
		}, nil)
	})
}

func TestDB_GetBucketID(t *testing.T) {
	t.Run("bucket does not exist", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		assert(db.GetBucketID("test")).
			Equals(uint64(0), errors.New("bucket \"test\" not exist"))
	})

	t.Run("test ok", func(t *testing.T) {
		assert := assert.New(t)
		db, _ := NewDB("test.db")
		defer func() {
			os.Remove("test.db")
		}()
		_ = db.CreateBucket("test")
		for i := uint64(1); i < 100; i++ {
			assert(db.GetBucketID("test")).Equals(i, nil)
		}
	})
}
