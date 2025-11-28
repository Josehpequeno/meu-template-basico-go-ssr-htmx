package models

import "time"

type Token struct {
	ID           uint `gorm:"primaryKey"`
	UserID       uint `gorm:"not null"`
	Token        string
	RefreshToken string
	ExpiresAt    time.Time
	CreatedAt    time.Time
}
