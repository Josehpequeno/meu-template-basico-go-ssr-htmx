package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type RateLimiter struct {
	mu       sync.Mutex
	limits   map[string]*rateLimit
	rate     int
	interval time.Duration
}

type rateLimit struct {
	count    int
	lastSeen time.Time
}

func NewRateLimiter(rate int, interval time.Duration) *RateLimiter {
	return &RateLimiter{
		limits:   make(map[string]*rateLimit),
		rate:     rate,
		interval: interval,
	}
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		rl.mu.Lock()
		defer rl.mu.Unlock()

		limit, exists := rl.limits[ip]
		if !exists {
			// Cria nova entrada e atribui à variável limit
			limit = &rateLimit{
				count:    1,
				lastSeen: time.Now(),
			}
			rl.limits[ip] = limit
			c.Next()
			return
		}

		// Resetar contador se passou o intervalo
		if time.Since(limit.lastSeen) > rl.interval {
			limit.count = 0
		}

		// Verificar se excedeu o limite
		if limit.count >= rl.rate {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{
				"error": "Limite de requisições excedido. Tente novamente mais tarde.",
			})
			return
		}

		// Incrementar contador e atualizar tempo
		limit.count++
		limit.lastSeen = time.Now()
		c.Next()
	}
}
