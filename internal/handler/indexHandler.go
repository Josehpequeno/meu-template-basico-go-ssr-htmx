package handler

import (
	"exemplo/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type IndexHandler struct {
	userService *services.UserService
}

func NewIndexHandler(us *services.UserService) *IndexHandler {
	return &IndexHandler{userService: us}
}

func (h *IndexHandler) IndexHandler(c *gin.Context) {
	//obter usuario
	user, err := h.userService.GetUser(c)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao obter informações do usuário"})
		return
	}

	data := gin.H{
		"Title":   "Página Inicial",
		"Navbar":  true,
		"User":    user,
		"AppName": "exemplo de Sistemas",
	}
	c.HTML(http.StatusOK, "index", data)
}
