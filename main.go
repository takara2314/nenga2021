package main

import (
	"crypto/sha256"
	"encoding/hex"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// ブラウザからXHRされたものを格納
type postedUserInfo struct {
	Name     string `json:"userName"`
	Password string `json:"userPassword"`
	OS       string `json:"userOS"`
	Agent    string `json:"userAgent"`
}

// データベースに格納するデータを格納
type userActivity struct {
	DateTime time.Time
	IP       string
	OS       string
	Browser  string
	Name     string
}

var users []string
var passwords []string

func main() {
	// 環境変数から、ハッシュ化されたユーザー名とパスワードを取得
	users = strings.Split(os.Getenv("USERS_HASHED"), ",")
	passwords = strings.Split(os.Getenv("PASSWORDS_HASHED"), ",")

	router := gin.Default()

	// HTMLテンプレートの読み込み (同じディレクトリで実行する扱い)
	router.LoadHTMLGlob("./*.html")
	// 静的ファイルの読み込み
	router.Static("/resources", "./resources")

	router.GET("/", rootGET)
	router.GET("/ar", arGET)
	router.POST("/auth", authPOST)
	router.NoRoute(noRoute)

	router.Run(":" + os.Getenv("PORT"))
}

// [GET] /
func rootGET(c *gin.Context) {
	c.String(http.StatusOK, "こんにちは、世界！")
}

// [GET] /ar
func arGET(c *gin.Context) {
	c.HTML(200, "AR.html", nil)
}

// [POST] /auth
func authPOST(c *gin.Context) {
	// POSTされたJSONを受け取り、格納する
	var postedJSON postedUserInfo
	_ = c.MustBindWith(&postedJSON, binding.JSON)

	// JSONの4つのバリューのどれか一つでも空白なら、Bad Request
	if postedJSON.Name == "" || postedJSON.Password == "" || postedJSON.OS == "" || postedJSON.Agent == "" {
		c.String(http.StatusBadRequest, "400 Bad Request")
		return
	}

	userInfo := userActivity{
		DateTime: time.Now(),
		IP:       c.ClientIP(),
		OS:       "Windows",
		Browser:  "Chrome",
		Name:     "Unknown",
	}

	// JSONの中に含まれる名前とパスワードを、ハッシュ化(SHA-256)して格納
	nameHashedBytes := sha256.Sum256([]byte(postedJSON.Name))
	var nameHashed string = hex.EncodeToString(nameHashedBytes[:])

	passHashedBytes := sha256.Sum256([]byte(postedJSON.Password))
	var passHashed string = hex.EncodeToString(passHashedBytes[:])

	// ユーザー名が存在し、そのユーザー名に関連付けられたパスワードと一致するなら
	index := findIndexSliceStr(users, nameHashed)
	if index != -1 && passwords[index] == passHashed {
		c.String(http.StatusOK, "OK")
		// 本人確認できたら、ユーザー情報にそのユーザーであることを代入
		userInfo.Name = postedJSON.Name
		return
	}
	c.String(http.StatusUnauthorized, "401 Unauthorized")
}

// 404
func noRoute(c *gin.Context) {
	c.String(http.StatusNotFound, "見つかりませんでした。")
}

// 対象の文字列型スライスから特定の文字列のインデックスを返す
func findIndexSliceStr(targetSlice []string, targetStr string) int {
	for i, str := range targetSlice {
		if targetStr == str {
			return i
		}
	}
	return -1
}
