package core

import (
	"errors"
	"io"
	"path/filepath"
	"strings"
	"testing"

	"github.com/rpccloud/assert"
)

func TestIsRemoteFile(t *testing.T) {
	t.Run("test", func(t *testing.T) {
		assert := assert.New(t)
		assert(IsRemoteFile("http")).IsFalse()
		assert(IsRemoteFile("https")).IsFalse()
		assert(IsRemoteFile("ftp:")).IsFalse()
		assert(IsRemoteFile(".")).IsFalse()
		assert(IsRemoteFile("./abc")).IsFalse()
		assert(IsRemoteFile("..")).IsFalse()
		assert(IsRemoteFile("../abc")).IsFalse()
		assert(IsRemoteFile("/user/home")).IsFalse()
		assert(IsRemoteFile("http:")).IsTrue()
		assert(IsRemoteFile("https:")).IsTrue()
		assert(IsRemoteFile("Http:")).IsTrue()
		assert(IsRemoteFile("httPs:")).IsTrue()
		assert(IsRemoteFile("\thttp:")).IsTrue()
		assert(IsRemoteFile(" https:")).IsTrue()
		assert(IsRemoteFile("http://example.com/abc.js")).IsTrue()
		assert(IsRemoteFile("https://example.com/abc.js")).IsTrue()
	})
}

func TestStandradURI(t *testing.T) {
	t.Run("url.Parse(uri) error", func(t *testing.T) {
		assert := assert.New(t)
		v, e := StandradURI(string([]byte{104, 116, 116, 112, 58, 0}))
		assert(v, e.Error()).Equals(
			"",
			"parse \"http:\\x00\": net/url: invalid control character in URL",
		)
	})

	t.Run("v.Fragment is not empty", func(t *testing.T) {
		assert := assert.New(t)
		assert(StandradURI("http://example.com/path#fragment")).
			Equals("", errors.New("\"#fragment\" is not supported"))
	})

	t.Run("v.RawQuery is not empty", func(t *testing.T) {
		assert := assert.New(t)
		assert(StandradURI("http://example.com/path?query=true")).
			Equals("", errors.New("\"?query=true\" is not supported"))
	})

	t.Run("v.User is not nil", func(t *testing.T) {
		assert := assert.New(t)
		assert(StandradURI("http://username:password@example.com/abc.js")).
			Equals("", errors.New("user are not supported for security reason"))
	})

	t.Run("v.Host is empty", func(t *testing.T) {
		assert := assert.New(t)
		assert(StandradURI("http://")).
			Equals("", errors.New("url \"http://\" is invalid"))
	})

	t.Run("v.Path is empty", func(t *testing.T) {
		assert := assert.New(t)
		assert(StandradURI("http://example.com")).
			Equals("", errors.New("url \"http://example.com\" is invalid"))
	})

	t.Run("get abs path error", func(t *testing.T) {
		assert := assert.New(t)

		fnGetAbsPath = func(path string) (string, error) {
			return "", errors.New("custom")
		}
		defer func() {
			fnGetAbsPath = filepath.Abs
		}()

		assert(StandradURI("/user/home")).Equals("", errors.New("custom"))
	})

	t.Run("test ok", func(t *testing.T) {
		assert := assert.New(t)

		assert(StandradURI("/user/test.js")).
			Equals("/user/test.js", nil)

		assert(StandradURI("https://example.com/test.js")).
			Equals("https://example.com/test.js", nil)

		assert(StandradURI("HTTP://example.com/test.js")).
			Equals("http://example.com/test.js", nil)

		assert(StandradURI("htTps://example.com/test.js")).
			Equals("https://example.com/test.js", nil)
	})
}

func TestReadFile(t *testing.T) {
	t.Run("read local file ok", func(t *testing.T) {
		assert := assert.New(t)

		v, e := ReadFile(".github/workflows/release.yml")
		assert(e).Equals(nil)
		assert(strings.Contains(string(v), "Release")).IsTrue()
	})

	t.Run("read local file error", func(t *testing.T) {
		assert := assert.New(t)
		v, e := ReadFile("error_file.js")
		assert(v).IsNil()
		assert(e).IsNotNil()
		assert(strings.Contains(
			e.Error(),
			"error_file.js: no such file or directory",
		)).IsTrue()
	})

	t.Run("read remote file ok", func(t *testing.T) {
		assert := assert.New(t)
		path := "https://github.com/rpccloud/vbot" +
			"/blob/master/.github/workflows/release.yml"
		v, e := ReadFile(path)

		assert(e).IsNil()
		assert(strings.Contains(string(v), "Release")).IsTrue()
	})

	t.Run("read remote file error", func(t *testing.T) {
		assert := assert.New(t)
		path := "https://err.error.err/err.js"
		v, e := ReadFile(path)
		assert(v).IsNil()
		assert(e).IsNotNil()
		assert(strings.Contains(e.Error(), "no such host")).IsTrue()
	})

	t.Run("url error", func(t *testing.T) {
		assert := assert.New(t)
		v, e := ReadFile("test.go")
		assert(v).IsNil()
		assert(strings.Contains(
			e.Error(),
			"no such file or directory",
		)).IsTrue()
	})

	t.Run("fnIOCopy error", func(t *testing.T) {
		assert := assert.New(t)
		path := "https://github.com/rpccloud/vbot" +
			"/blob/master/.github/workflows/release.yml"
		fnIOCopy = func(_ io.Writer, _ io.Reader) (int64, error) {
			return 0, errors.New("custom")
		}

		defer func() {
			fnIOCopy = io.Copy
		}()

		assert(ReadFile(path)).
			Equals(nil, errors.New("custom"))
	})
}

func TestEncrypt(t *testing.T) {
	t.Run("test ok", func(t *testing.T) {
		assert := assert.New(t)

		for i := 0; i < 100; i++ {
			data := []byte(GetRandString(100))
			password := []byte(GetRandString(10))
			enData, e := Encrypt(password, data)
			assert(e).IsNil()
			assert(Decrypt(password, enData)).Equals(data, nil)
		}
	})
}
