package vbot

import (
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
)

var fnGetAbsPath = filepath.Abs

func CheckBytes(b []byte) error {
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

		_, e = io.Copy(buffer, resp.Body)
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
