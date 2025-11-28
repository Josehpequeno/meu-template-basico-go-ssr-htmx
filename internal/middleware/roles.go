package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func RolesMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleRaw, exists := c.Get("userRole")
		if !exists {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Role não encontrada"})
			return
		}
		role, ok := roleRaw.(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Role inválida"})
			return
		}

		for _, r := range allowedRoles {
			if r == role {
				c.Next()
				return
			}
		}
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
	}
}
