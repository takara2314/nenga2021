package main

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/", rootGET)
	router.GET("/ar", arGET)
	router.NoRoute(noRoute)

	router.Run(":" + os.Getenv("PORT"))
}

func rootGET(c *gin.Context) {
	c.String(http.StatusOK, "こんにちは、世界！")
}

func arGET(c *gin.Context) {
	c.String(http.StatusOK, "ARの世界へようこそ！")
}

func noRoute(c *gin.Context) {
	c.String(http.StatusNotFound, "見つかりませんでした。")
}
