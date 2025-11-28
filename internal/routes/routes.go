package routes

import (
	"exemplo/internal/config"
	"exemplo/internal/handler"
	"exemplo/internal/middleware"
	"exemplo/internal/services"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"
)

func SetupRouter(
	cfg *config.Config,
	authHandler *handler.AuthHandler,
	rateLimiter *middleware.RateLimiter,
	userService *services.UserService,
) *gin.Engine {
	r := gin.Default()

	store := cookie.NewStore([]byte(cfg.SessionSecret))
	store.Options(sessions.Options{
		Path:     "/",
		MaxAge:   int(cfg.RefreshExpiration.Seconds()),
		HttpOnly: true,
		Secure:   cfg.Prod,
		SameSite: http.SameSiteLaxMode,
	})
	r.Use(sessions.Sessions("exemplo_session", store))

	//inicia handlers
	indexHandler := handler.NewIndexHandler(userService)

	r.Use(rateLimiter.Middleware())
	public := r.Group("/")
	{
		public.GET("/login", handler.LoginHandler)
		public.POST("/login", authHandler.Login)
	}

	protected := r.Group("/")
	protected.Use(middleware.SessionAuthMiddleware())
	{
		normalRoutes := protected.Group("/")
		normalRoutes.Use(middleware.RolesMiddleware("normal"))
		{
		}
		masterRoutes := protected.Group("/")
		masterRoutes.Use(middleware.RolesMiddleware("master"))
		{
		}
		normalAndMasterRoutes := protected.Group("/")
		normalAndMasterRoutes.Use(middleware.RolesMiddleware("normal", "master"))
		{
			normalAndMasterRoutes.GET("/", indexHandler.IndexHandler)
		}

	}
	return r
}
