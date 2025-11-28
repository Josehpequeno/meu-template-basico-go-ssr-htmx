package repository

import (
	"exemplo/internal/models"

	"gorm.io/gorm"
)

type TokenRepository struct {
	db *gorm.DB
}

func NewTokenRepository(db *gorm.DB) *TokenRepository {
	return &TokenRepository{db: db}
}

func (r *TokenRepository) Save(token *models.Token) error {
	return r.db.Save(token).Error
}

func (r *TokenRepository) FindByToken(token string) (*models.Token, error) {
	var t models.Token
	err := r.db.Where("token = ?", token).First(&t).Error
	return &t, err
}

func (r *TokenRepository) Delete(token string) error {
	return r.db.Where("token = ?", token).Delete(&models.Token{}).Error
}
