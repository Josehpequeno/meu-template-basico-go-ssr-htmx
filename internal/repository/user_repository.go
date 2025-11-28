package repository

import (
	"errors"
	"exemplo/internal/models"
	"log"
	"os"
	"time"

	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	// Cria o usuário admin padrão se não existir
	adminPassword := os.Getenv("ADMIN_PASSWORD")
	user := &models.User{}
	hashedPassword, err := user.CreateHashPassword(adminPassword)
	if err != nil {
		panic("failed to hash admin password: " + err.Error())
	}

	var existingUser models.User
	result := db.Where("username = ?", "master").First(&existingUser)

	if result.Error != nil {
		//se não existe cria
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			// Cria o usuário master usando SQL raw para evitar o default:true
			err := db.Exec(`
        INSERT INTO users 
        (username, password, role, email, cpf, must_change_password, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				"master",
				hashedPassword,
				models.Master,
				"hicarosoares@uespi.br",
				"Sem cpf master",
				false, // Força false explicitamente
				time.Now(),
				time.Now(),
			).Error

			if err != nil {
				log.Println("failed to create master user: " + err.Error())
			}
		} else {
			log.Println("Failed to query master user: " + result.Error.Error())
		}
	} else if result.Error == nil {
		log.Println("Usuário master já existe - nenhuma alteração realizada")
	} else {
		log.Println("failed to check master user: " + result.Error.Error())
	}
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

func (r *UserRepository) FindByUsername(username string) (*models.User, error) {
	var user models.User
	err := r.db.Where("username = ?", username).First(&user).Error
	return &user, err
}

func (r *UserRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	if err := r.db.First(&user, id).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Update(user *models.User) error {
	return r.db.Save(user).Error
}

func (r *UserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) Delete(user *models.User) error {
	return r.db.Delete(user).Error
}

func (r *UserRepository) FindAll() ([]models.User, error) {
	var users []models.User
	err := r.db.Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *UserRepository) FindAllByRole(role models.Role) ([]models.User, error) {
	var users []models.User
	err := r.db.Where("role = ?", role).Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *UserRepository) DeactivateUser(user *models.User) error {
	user.Active = false
	return r.db.Save(user).Error
}

func (r *UserRepository) ActivateUser(user *models.User) error {
	user.Active = true
	return r.db.Save(user).Error
}

func (r *UserRepository) UpdateLastLogin(user *models.User) error {
	now := time.Now()
	user.LastLogin = &now
	return r.db.Model(&user).UpdateColumn("last_login", now).Error //ignorar o updated_at
}
