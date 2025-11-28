package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/unrolled/secure"
)

func HTTPSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		secureMiddleware := secure.New(secure.Options{
			SSLRedirect: true,            // Redireciona HTTP para HTTPS
			SSLHost:     "localhost:443", // Substitua pelo seu domínio
		})

		err := secureMiddleware.Process(c.Writer, c.Request)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Erro ao aplicar middleware de segurança"})
			return
		}
		c.Next()
	}
}
