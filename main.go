package main

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// ブラウザからXHRされたものを格納
type postedUserInfo struct {
	Password string `json:"userPassword"`
	Agent    string `json:"userAgent"`
}

// データベースに格納するデータを格納
type userActivity struct {
	DateTime time.Time
	IP       string
	Device   string
	Browser  string
	ID       int
}

var passwords []string

func main() {
	// 環境変数から、ハッシュ化されたユーザー名とパスワードを取得
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
	if postedJSON.Password == "" || postedJSON.Agent == "" {
		c.String(http.StatusBadRequest, "400 Bad Request")
		return
	}

	userInfo := userActivity{
		DateTime: timeDiffConv(time.Now()),
		IP:       c.ClientIP(),
		Device:   getDevice(postedJSON.Agent),
		Browser:  getBrowser(postedJSON.Agent),
		ID:       -1,
	}

	// JSONの中に含まれるパスワードを、ハッシュ化(SHA-256)して格納
	passHashedBytes := sha256.Sum256([]byte(postedJSON.Password))
	var passHashed string = hex.EncodeToString(passHashedBytes[:])

	// パスワードが一致するなら
	if passIndex := findIndexSliceStr(passwords, passHashed); passIndex != -1 {
		c.String(http.StatusOK, "OK")
		// 本人確認できたら、ユーザー情報にそのユーザーのID(インデックス)を代入
		userInfo.ID = passIndex

		fmt.Printf(
			"あるユーザーのログインを許可しました。\nID: %d\n時刻: %s\nIPアドレス: %s\nデバイス: %s\nブラウザ: %s\nユーザーエージェント: %s\n",
			userInfo.ID,
			userInfo.DateTime.Format("2006年1月2日 15時4分5秒"),
			userInfo.IP,
			userInfo.Device,
			userInfo.Browser,
			postedJSON.Agent,
		)

		return
	}

	c.String(http.StatusUnauthorized, "401 Unauthorized")

	fmt.Printf(
		"ログインを試みたユーザーがいましたが、ブロックしました。\n時刻: %s\nIPアドレス: %s\nデバイス: %s\nブラウザ: %s\nユーザーエージェント: %s\n",
		userInfo.DateTime.Format("2006年1月2日 15時4分5秒"),
		userInfo.IP,
		userInfo.Device,
		userInfo.Browser,
		postedJSON.Agent,
	)
}

// 404
func noRoute(c *gin.Context) {
	c.String(http.StatusNotFound, "見つかりませんでした。")
}

// 時差変換をして返す関数
func timeDiffConv(tTime time.Time) (rTime time.Time) {
	// よりUTCらしくする
	rTime = tTime.UTC()

	// UTC → JST
	var jst *time.Location = time.FixedZone("Asia/Tokyo", 9*60*60)
	rTime = rTime.In(jst)

	return
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
