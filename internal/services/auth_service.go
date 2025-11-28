package services

import (
	"errors"
	"exemplo/internal/config"
	"exemplo/internal/models"
	"exemplo/internal/repository"
	"exemplo/internal/utils"
	"strings"
	"time"
)

type AuthService struct {
	userRepo  *repository.UserRepository
	tokenRepo *repository.TokenRepository
	cfg       *config.Config
}

func NewAuthService(userRepo *repository.UserRepository, tokenRepo *repository.TokenRepository, cfg *config.Config) *AuthService {
	return &AuthService{
		userRepo:  userRepo,
		tokenRepo: tokenRepo,
		cfg:       cfg,
	}
}

func (s *AuthService) Login(username, password string) (*models.User, string, string, error) {
	user, err := s.userRepo.FindByUsername(username)
	if err != nil {
		return nil, "", "", nil
	}

	if err := user.CheckPassword(strings.TrimSpace(password)); err != nil {
		return nil, "", "", errors.New("credenciais inválidas")
	}

	accessToken, refreshToken, err := utils.GenerateJWT(user, s.cfg)
	if err != nil {
		return nil, "", "", err
	}

	// salvar refresh token
	token := &models.Token{
		UserID:       user.ID,
		Token:        accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    time.Now().Add(s.cfg.RefreshExpiration),
	}

	if err := s.tokenRepo.Save(token); err != nil {
		return nil, "", "", err
	}

	return user, accessToken, refreshToken, nil
}

func (s *AuthService) RefreshToken(refreshToken string) (string, string, error) {
	claims, err := utils.ValidateToken(refreshToken, s.cfg.JWTRefreshSecret)
	if err != nil {
		return "", "", errors.New("token inválida")
	}

	userID := uint(claims["sub"].(float64))
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return "", "", errors.New("usuário não encontrado")
	}

	// gerar novos tokens
	newAccessToken, newRefreshToken, err := utils.GenerateJWT(user, s.cfg)
	if err != nil {
		return "", "", err
	}

	// atualiza token no banco
	if err := s.tokenRepo.Delete(refreshToken); err != nil {
		return "", "", err
	}

	token := &models.Token{
		UserID:       user.ID,
		Token:        newAccessToken,
		RefreshToken: newRefreshToken,
		ExpiresAt:    time.Now().Add(s.cfg.RefreshExpiration),
	}

	if err := s.tokenRepo.Save(token); err != nil {
		return "", "", err
	}

	return newAccessToken, newRefreshToken, nil
}

func (s *AuthService) FindByID(id string) (*models.User, error) {
	// converte string para uint
	uid, err := utils.StringToUint(id)
	if err != nil {
		return nil, errors.New("ID inválido")
	}
	return s.userRepo.FindByID(uid)
}

func (s *AuthService) CreateUser(user *models.User) error {
	if err := s.userRepo.Create(user); err != nil {
		return err
	}
	return nil
}

func (s *AuthService) UpdateLastLogin(user *models.User) error {
	return s.userRepo.UpdateLastLogin(user)
}
