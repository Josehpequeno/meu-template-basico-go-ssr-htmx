package handler

import (
	"exemplo/internal/models"
	"exemplo/internal/services"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService *services.AuthService
}

func NewAuthHandler(authService *services.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

func (ah *AuthHandler) Login(c *gin.Context) {
	var loginRequest models.LoginRequest
	if err := c.ShouldBind(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	user, accessToken, refreshToken, err := ah.authService.Login(loginRequest.Username, loginRequest.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if user == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "usuário não encontrado"})
		return
	}

	// 4) verifica se usuário está ativo
	if !user.Active {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuário inativo"})
		return
	}

	// 5) verifica senha
	if err := user.CheckPassword(loginRequest.Password); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "credenciais inválidas"})
		return
	}

	// 6) atualiza last login
	if err := ah.authService.UpdateLastLogin(user); err != nil {
		log.Println("Erro ao atualizar last login:", err)
	}

	// SALVANDO na sessão
	session := sessions.Default(c)
	session.Set("user_id", user.ID)                        // ID já existia
	session.Set("user_role", fmt.Sprintf("%v", user.Role)) // ← agora salvamos a role
	if err := session.Save(); err != nil {
		log.Println("Erro ao salvar sessão:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "falha ao salvar sessão"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": accessToken, "refresh_token": refreshToken, "user": user})
}

func (ah *AuthHandler) Logout(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear() // Limpa a sessão
	if err := session.Save(); err != nil {
		log.Println("Erro ao salvar sessão:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "falha ao salvar sessão"})
		return
	}
	c.Redirect(http.StatusFound, "/login")
}

func (ah *AuthHandler) RefreshToken(c *gin.Context) {
	var refreshReq struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&refreshReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	accessToken, refreshToken, err := ah.authService.RefreshToken(refreshReq.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": accessToken, "refresh_token": refreshToken})
}

// o novo endpoint /me
func (ah *AuthHandler) Me(c *gin.Context) {
	raw, _ := c.Get("user_id")
	userID := raw.(uint)
	user, err := ah.authService.FindByID(fmt.Sprintf("%d", userID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}
