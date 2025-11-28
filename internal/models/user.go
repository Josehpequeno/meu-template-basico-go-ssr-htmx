package models

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

type Role string

const (
	Normal Role = "normal"
	Master Role = "master"
)

type User struct {
	ID                 uint   `gorm:"primaryKey"`
	Username           string `gorm:"unique;not null"`
	Password           string `gorm:"not null"`
	Role               Role   `gorm:"not null"`
	Email              string `gorm:"unique;not null"`
	CPF                string `gorm:"unique;"`
	MustChangePassword bool   `gorm:"default:true"`
	Picture            *string
	Active             bool `gorm:"default:true"`
	LastLogin          *time.Time
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

type LoginRequest struct {
	Username string `json:"username" form:"username" binding:"required,min=3,max=50,alphanum"`
	Password string `json:"password" form:"password" binding:"required,min=4,max=100"`
}

func (u *User) HashPassword() error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

func (u *User) CheckPassword(password string) error {
	return bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
}

func (u *User) CreateHashPassword(pass string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

// BeforeCreate é chamado pelo GORM antes de inserir o registro.
// func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
// 	if u.Role == AlunoRole {
// 		// 1) Username: se não vier preenchido, usamos o CPF todo
// 		if strings.TrimSpace(u.Username) == "" {
// 			u.Username = u.CPF
// 		}
// 		// 2) Gera a senha inicial automaticamente
// 		u.GenerateInitialPassword()
// 	}
// 	return nil
// }
