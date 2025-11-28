package services

import (
	"exemplo/internal/models"
	"exemplo/internal/repository"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserService struct {
	userRepo *repository.UserRepository
}

func NewUserService(userRepo *repository.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (s *UserService) CreateUser(user *models.User) error {
	if err := user.HashPassword(); err != nil {
		return err
	}
	return s.userRepo.Create(user)
}

func (s *UserService) UpdateUser(user *models.User) error {
	return s.userRepo.Update(user)
}

func (s *UserService) GetUserByID(id uint) (*models.User, error) {
	return s.userRepo.FindByID(id)
}

func (s *UserService) GetUserByEmail(email string) (*models.User, error) {
	return s.userRepo.FindByEmail(email)
}

func (s *UserService) DeleteUser(id uint) error {
	user, err := s.userRepo.FindByID(id)
	if err != nil {
		return err
	}
	if user.Role == models.Master {
		return fmt.Errorf("não é permitido deletar usuário com papel de master")
	}
	return s.userRepo.Delete(user)
}

func (s *UserService) ListUsers() ([]models.User, error) {
	users, err := s.userRepo.FindAll()
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) ListUsersByRole(role models.Role) ([]models.User, error) {
	users, err := s.userRepo.FindAllByRole(role)
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) ChangePassword(user *models.User, newPassword string) error {
	newPassword, err := user.CreateHashPassword(newPassword)
	if err != nil {
		return err
	}
	user.Password = newPassword
	user.MustChangePassword = false
	return s.userRepo.Update(user)
}

func (s *UserService) ResetPassword(user *models.User) error {
	newPassword, err := user.CreateHashPassword(user.Username) // senha padrão é o username
	if err != nil {
		return err
	}
	if user.Role == models.Master {
		return fmt.Errorf("não é permitido resetar senha de usuário com papel de master")
	}
	user.Password = newPassword
	user.MustChangePassword = true
	return s.userRepo.Update(user)
}

// pega o usuário autenticado pelo ID salvo no contexto
func (s *UserService) GetUser(c *gin.Context) (*models.User, error) {
	userId := c.MustGet("userID").(uint)

	if s == nil {
		log.Println("UserService não inicializado")
		return nil, fmt.Errorf("user service não inicializado")
	}
	if s.userRepo == nil {
		log.Println("UserRepository não inicializado")
		return nil, fmt.Errorf("user repository não inicializado")
	}

	user, err := s.userRepo.FindByID(userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Usuário não encontrado"})
		return &models.User{}, err
	}
	return user, nil
}

func (s *UserService) ToggleUserActiveStatus(userId uint) error {
	user, err := s.userRepo.FindByID(userId)
	if err != nil {
		return err
	}
	if user.Active {
		return s.userRepo.DeactivateUser(user)
	}
	return s.userRepo.ActivateUser(user)
}

func (s *UserService) UpdateLastLogin(user *models.User) error {
	return s.userRepo.UpdateLastLogin(user)
}
