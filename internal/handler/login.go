package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func LoginHandler(c *gin.Context) {

	data := gin.H{
		"Title":   "exemplo de Sistemas - UESPI",
		"AppName": "exemplo de Sistemas - UESPI",
		"Navbar":  false,
	}

	// Renderiza o template com paginação
	c.HTML(http.StatusOK, "login", data)
}
