package config

import (
	"fmt"
	"os"
	"time"
)

type Config struct {
	DBHost            string
	DBPort            string
	DBUser            string
	DBPassword        string
	DBName            string
	JWTSecret         string
	JWTRefreshSecret  string
	TokenExpiration   time.Duration
	RefreshExpiration time.Duration
	HTTPSEnabled      bool
	CertFile          string
	KeyFile           string
	RateLimit         int
	RateInterval      time.Duration
	SessionSecret     string // Adicione esta linha para a chave secreta da sessão
	Prod              bool
}

func LoadConfig() *Config {
	return &Config{
		DBHost:            getEnv("DB_HOST_PS", "localhost"),
		DBPort:            getEnv("DB_PORT_PS", "5432"),
		DBUser:            getEnv("DB_USER_PS", "postgres"),
		DBPassword:        getEnv("DB_PASSWORD_PS", "postgres"),
		DBName:            getEnv("DB_NAME_PS", "exemplo_db"),
		JWTSecret:         getEnv("JWT_SECRET", "default_secret"),
		JWTRefreshSecret:  getEnv("JWT_REFRESH_SECRET", "default_refresh_secret"),
		TokenExpiration:   15 * time.Minute,
		RefreshExpiration: 7 * 24 * time.Hour,
		HTTPSEnabled:      os.Getenv("HTTPS_ENABLED") == "true",
		CertFile:          getEnv("CERT_FILE", "cert.pem"),
		KeyFile:           getEnv("KEY_FILE", "key.pem"),
		RateLimit:         1000,
		RateInterval:      5 * time.Minute,
		SessionSecret:     getEnv("SESSION_SECRET", "uma-senha-secreta"),
		Prod:              os.Getenv("ENV") == "production",
	}
}

// Adicione este novo método para gerar a string de conexão
func (c *Config) GetDBConnectionString() string {
	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		c.DBHost, c.DBUser, c.DBPassword, c.DBName, c.DBPort)
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
