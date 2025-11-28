package middleware

import (
	"exemplo/internal/config"
	"exemplo/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	// log.Println("AuthMiddleware initialized with JWT secret:", cfg)
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token de autenticação não fornecido"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		claims, err := utils.ValidateToken(tokenString, cfg.JWTSecret)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token de autenticação inválido"})
			return
		}

		// log.Println("Token válido para usuário:", claims["sub"], "com role:", claims["role"])
		c.Set("userID", claims["sub"])
		c.Set("userRole", claims["role"])
		c.Next()
	}
}
