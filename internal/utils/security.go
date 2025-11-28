package utils

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"exemplo/internal/config"
	"time"
)

func RotateJWTKeys(cfg *config.Config) {
	ticker := time.NewTicker(30 * 24 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
		if err != nil {
			continue
		}

		privateKeysBytes := x509.MarshalPKCS1PrivateKey(privateKey)
		privateKeyPEM := pem.EncodeToMemory(&pem.Block{
			Type:  "RSA PRIVATE KEY",
			Bytes: privateKeysBytes,
		})

		publicKeysBytes, err := x509.MarshalPKIXPublicKey(&privateKey.PublicKey)
		if err != nil {
			continue
		}

		publicKeyPEM := pem.EncodeToMemory(&pem.Block{
			Type:  "PUBLIC KEY",
			Bytes: publicKeysBytes,
		})

		cfg.JWTSecret = string(privateKeyPEM)
		cfg.JWTRefreshSecret = string(publicKeyPEM)
	}
}
