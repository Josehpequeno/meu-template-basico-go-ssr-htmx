package main

import (
	"exemplo/functions"
	"exemplo/internal/config"
	"exemplo/internal/handler"
	"exemplo/internal/middleware"
	"exemplo/internal/models"
	"exemplo/internal/repository"
	"exemplo/internal/routes"
	"exemplo/internal/services"
	"exemplo/internal/utils"
	"html/template"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type PageData struct {
	Title  string
	Navbar template.HTML
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Aviso: Não foi possível carregar o arquivo .env. Usando configurações padrão.")
	}
	cfg := config.LoadConfig()

	if cfg.Prod {
		gin.SetMode(gin.ReleaseMode) // Modo produção por padrão
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// Inicializar banco de dados
	db, err := gorm.Open(postgres.Open(cfg.GetDBConnectionString()), &gorm.Config{})
	if err != nil {
		log.Fatal("Erro ao conectar ao banco de dados:", err)
	}
	// Migrações
	//cria as tabelas de acordo com os modelos
	if err := db.AutoMigrate(&models.User{}, &models.Token{}); err != nil {
		log.Fatal("Erro ao executar migrações:", err)
	}

	var userServ *services.UserService
	userRepo := repository.NewUserRepository(db)
	if userRepo != nil {
		userServ = services.NewUserService(userRepo)
		log.Println("✓ UserService inicializado com sucesso")
	} else {
		log.Println("✗ ERRO: Não foi possível inicializar UserRepository")
		// Crie um service vazio para não quebrar o sistema
		userServ = &services.UserService{}
	}
	tokenRepo := repository.NewTokenRepository(db)

	// Inicializar serviços
	authService := services.NewAuthService(userRepo, tokenRepo, cfg)

	// Inicializar controladores
	authController := handler.NewAuthHandler(authService)

	// Inicializar rate limiter
	rateLimiter := middleware.NewRateLimiter(cfg.RateLimit, cfg.RateInterval)

	r := routes.SetupRouter(cfg, authController, rateLimiter, userServ)

	// Rotacionamento de chaves JWT
	go utils.RotateJWTKeys(cfg)

	r.Delims("{{", "}}")
	r.HTMLRender = functions.CreateMyRender() // Usa o renderizador multitemplate

	// Configura arquivos estáticos
	r.Static("/public", "./public")
	r.Static("/static", "./static")

	// Capturar sinais de desligamento
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Inicia o servidor
	port := os.Getenv("PORT")
	if port == "" {
		port = "5005"
	}

	go func() {
		log.Printf("Servidor rodando na porta %s\n", port)
		if err := r.Run(":" + port); err != nil {
			log.Fatal("Erro ao iniciar servidor:", err)
		}
	}()
	<-sigChan
	log.Println("Desligando servidor...")

}
