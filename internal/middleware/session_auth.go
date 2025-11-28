package middleware

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// SessionAuthMiddleware garante que exista user_id na sessão
func SessionAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		session := sessions.Default(c)

		// pega o user_id
		rawID := session.Get("user_id")
		if rawID == nil {
			c.Redirect(http.StatusFound, "/login")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "não autenticado"})
			return
		}
		// converte para uint (ajuste se for int)
		userID, ok := rawID.(uint)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "ID de sessão inválido"})
			return
		}

		// pega o user_role
		rawRole := session.Get("user_role")
		if rawRole == nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "role não encontrada na sessão"})
			return
		}
		userRole, ok := rawRole.(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "role de sessão inválida"})
			return
		}

		// injeta no contexto do Gin
		c.Set("userID", userID)
		c.Set("userRole", userRole)

		c.Next()
	}
}
