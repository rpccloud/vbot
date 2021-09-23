package vbot

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"errors"
	"fmt"
	"io"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"

	"golang.org/x/crypto/scrypt"
)

var fnGetAbsPath = filepath.Abs
var fnIOCopy = io.Copy
var base64String = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
	"abcdefghijklmnopqrstuvwxyz" +
	"0123456789" +
	"+/"

func CheckBytes(b []byte) error {
	if len(b) == 0 {
		return errors.New("bytes is empty")
	}

	return nil
}

func IsRemoteFile(uri string) bool {
	uri = strings.TrimSpace(uri)
	if len(uri) >= 5 && strings.ToLower(uri[:5]) == "http:" {
		return true
	}

	if len(uri) >= 6 && strings.ToLower(uri[:6]) == "https:" {
		return true
	}

	return false
}

func StandradURI(uri string) (string, error) {
	uri = strings.TrimSpace(uri)

	ret := ""

	if IsRemoteFile(uri) {
		// http or https url
		if v, e := url.Parse(uri); e != nil {
			return "", e
		} else if v.Fragment != "" {
			return "", fmt.Errorf("\"#%s\" is not supported", v.Fragment)
		} else if v.RawQuery != "" {
			return "", fmt.Errorf("\"?%s\" is not supported", v.RawQuery)
		} else if v.User != nil {
			return "", fmt.Errorf("user are not supported for security reason")
		} else if v.Host == "" {
			return "", fmt.Errorf("url \"%s\" is invalid", uri)
		} else if v.Path == "" {
			return "", fmt.Errorf("url \"%s\" is invalid", uri)
		} else {
			ret = fmt.Sprintf("%s://%s%s", v.Scheme, v.Host, v.Path)
		}
	} else if absPath, e := fnGetAbsPath(uri); e != nil {
		// local file system
		return "", e
	} else {
		// local file system
		ret = absPath
	}

	if ext := filepath.Ext(ret); ext != ".js" {
		return "", fmt.Errorf("extension \"%s\" is invalid", ext)
	}

	return ret, nil
}

func ReadFile(uri string) ([]byte, error) {
	sUri, e := StandradURI(uri)
	if e != nil {
		return nil, e
	}

	if IsRemoteFile(sUri) {
		buffer := &bytes.Buffer{}
		resp, e := http.Get(sUri)
		if e != nil {
			return nil, e
		}
		defer resp.Body.Close()

		_, e = fnIOCopy(buffer, resp.Body)
		if e != nil {
			return nil, e
		}

		ret := buffer.Bytes()
		e = CheckBytes(ret)
		if e != nil {
			return nil, e
		}
		return ret, nil
	} else {
		return ioutil.ReadFile(sUri)
	}
}

func Encrypt(password, data []byte) ([]byte, error) {
	salt := []byte(GetRandString(32))

	key, e := scrypt.Key(password, salt, 32768, 8, 1, 32)
	if e != nil {
		return nil, e
	}

	blockCipher, e := aes.NewCipher(key)
	if e != nil {
		return nil, e
	}

	gcm, e := cipher.NewGCM(blockCipher)
	if e != nil {
		return nil, e
	}

	nonce := make([]byte, gcm.NonceSize())
	if _, e = rand.Read(nonce); e != nil {
		return nil, e
	}
	ciphertext := gcm.Seal(nonce, nonce, data, nil)

	ciphertext = append(ciphertext, salt...)

	return ciphertext, nil
}

func Decrypt(password, data []byte) ([]byte, error) {
	salt, data := data[len(data)-32:], data[:len(data)-32]

	key, e := scrypt.Key(password, salt, 32768, 8, 1, 32)
	if e != nil {
		return nil, e
	}

	blockCipher, e := aes.NewCipher(key)
	if e != nil {
		return nil, e
	}

	gcm, e := cipher.NewGCM(blockCipher)
	if e != nil {
		return nil, e
	}

	nonce, ciphertext := data[:gcm.NonceSize()], data[gcm.NonceSize():]

	plaintext, e := gcm.Open(nil, nonce, ciphertext, nil)
	if e != nil {
		return nil, e
	}

	return plaintext, nil
}

func GetRandString(length int) string {
	buf := &bytes.Buffer{}

	for length > 0 {
		rand64 := rand.Uint64()
		for used := 0; used < 10 && length > 0; used++ {
			buf.WriteByte(base64String[rand64%64])
			rand64 = rand64 / 64
			length--
		}
	}

	return buf.String()
}