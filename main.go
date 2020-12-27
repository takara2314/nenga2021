package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// HTMLテンプレートの読み込み (同じディレクトリで実行する扱い)
	router.LoadHTMLGlob("./*.html")
	// 静的ファイルの読み込み
	router.Static("/resources", "./resources")

	router.GET("/", rootGET)
	router.GET("/ar", arGET)
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

// 404
func noRoute(c *gin.Context) {
	c.String(http.StatusNotFound, "見つかりませんでした。")
}
