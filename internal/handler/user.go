package handler

import (
	"exemplo/internal/models"
	"exemplo/internal/services"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	UserService *services.UserService
}

func NewUserHandler(us *services.UserService) *UserHandler {
	return &UserHandler{
		UserService: us,
	}
}

func verifyUserParamID(c *gin.Context) (uint, bool) {
	userId := c.Param("id")
	if userId == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "ID do usuário é obrigatório"})
		return 0, false
	}

	//convert userId to uint
	id, err := strconv.ParseUint(userId, 10, 64)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "ID do usuário inválido"})
		return 0, false
	}
	return uint(id), true
}

func getUserDBifExists(uh *UserHandler, c *gin.Context) (*models.User, bool) {
	id, ok := verifyUserParamID(c)
	if !ok {
		return nil, false
	}

	userDB, err := uh.UserService.GetUserByID(id)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar usuário", "details": err.Error()})
		return nil, false
	}
	if userDB == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return nil, false
	}
	return userDB, true
}

func (uh *UserHandler) ListUsers(c *gin.Context) {
	users, err := uh.UserService.ListUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func (uh *UserHandler) CreateUser(c *gin.Context) {
	var userForm struct {
		Username string `form:"username" binding:"required, min=3, max=50"`
		Email    string `form:"email" binding:"required,email"`
		Role     string `form:"role" binding:"required,oneof=normal master"`
	}

	if err := c.ShouldBind(&userForm); err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	newUser := &models.User{
		Username: userForm.Username,
		Email:    userForm.Email,
		Role:     models.Role(userForm.Role),
		Active:   true,
		Password: strings.TrimSpace(userForm.Username),
	}

	if err := uh.UserService.CreateUser(newUser); err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": "Erro ao criar usuário", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": fmt.Sprintf("Usuários %s criado com sucesso!", newUser.Username)})
}

func (uh *UserHandler) UpdateUser(c *gin.Context) {
	userDB, err := getUserDBifExists(uh, c)
	if !err {
		return
	}

	var user struct {
		Username string `form:"username" binding:"required, min=3, max=50"`
		Email    string `form:"email" binding:"required,email"`
		CPF      string `form:"cpf" binding:"omitempty,len=11"`
	}

	if err := c.ShouldBind(&user); err != nil {
		c.AbortWithStatusJSON(400, gin.H{"error": "Dados inválidos", "details": err.Error()})
		return
	}

	// atualiza os campos do usuário
	userDB.Username = strings.TrimSpace(user.Username)
	userDB.Email = strings.TrimSpace(user.Email)
	userDB.CPF = strings.TrimSpace(user.CPF)

	if err := uh.UserService.UpdateUser(userDB); err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": "Erro ao atualizar usuário", "details": err.Error()})
		return
	}
	userDB.Password = ""

	c.JSON(http.StatusOK, gin.H{"message": "Usuário atualizado com sucesso", "user": userDB})
}

func (uh *UserHandler) ToggleUserActiveStatus(c *gin.Context) {
	userDB, err := getUserDBifExists(uh, c)
	if !err {
		return
	}

	userDB.Active = !userDB.Active

	if err := uh.UserService.UpdateUser(userDB); err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": "Erro ao atualizar status do usuário", "details": err.Error()})
		return
	}

	status := "ativado"
	if !userDB.Active {
		status = "desativado"
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Usuário %s com sucesso", status)})
}

func (uh *UserHandler) GetUser(c *gin.Context) {
	userDB, err := getUserDBifExists(uh, c)
	if !err {
		return
	}

	userDB.Password = ""

	c.JSON(http.StatusOK, gin.H{"user": userDB})
}

func (uh *UserHandler) DeleteUser(c *gin.Context) {
	userDB, err := getUserDBifExists(uh, c)
	if !err {
		return
	}

	if err := uh.UserService.DeleteUser(userDB.ID); err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": "Erro ao deletar usuário", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Usuário deletado com sucesso"})
}

func (uh *UserHandler) ResetPassword(c *gin.Context) {
	userDB, err := getUserDBifExists(uh, c)
	if !err {
		return
	}

	if err := uh.UserService.ResetPassword(userDB); err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": "Erro ao resetar senha do usuário", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha resetada com sucesso"})
}

func (uh *UserHandler) ChangePassword(c *gin.Context) {
	var req struct {
		UserID          uint   `form:"user_id" binding:"required,min=1,max=10000000"`
		CurrentPassword string `form:"current_password" binding:"required,min=4,max=100"`
		NewPassword     string `form:"new_password" binding:"required,min=4,max=100"`
		ConfirmPassword string `form:"confirm_new_password" binding:"required,min=4,max=100"`
	}

	if err := c.ShouldBind(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}
	if req.ConfirmPassword != req.NewPassword || req.NewPassword == "" || req.CurrentPassword == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "As senhas não coincidem ou estão vazias"})
		return
	}

	user, err := uh.UserService.GetUserByID(req.UserID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	if user.CheckPassword(req.CurrentPassword) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Senha atual incorreta"})
		return
	}

	if err := uh.UserService.ChangePassword(user, req.NewPassword); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao alterar senha"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha alterada com sucesso"})

}

// rota de exemplo para dashboard admin
func (uh *UserHandler) Profile(c *gin.Context) {
	user, err := uh.UserService.GetUser(c)
	if err != nil {
		log.Println("Erro ao obter usuário:", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Usuário não encontrado"})
		return
	}

	roleRaw, exists := c.Get("userRole")
	if !exists {
		log.Println("Role não encontrada no contexto", roleRaw, exists)
		c.JSON(http.StatusForbidden, gin.H{"error": "Role não encontrada"})
		return
	}
	role, ok := roleRaw.(string)
	if !ok {
		c.JSON(http.StatusForbidden, gin.H{"error": "Role inválida"})
		return
	}
	if role != "admin" && role != "master" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acesso restrito a admins"})
		return
	}

	normalUsers, err := uh.UserService.ListUsersByRole(models.Normal)
	if err != nil {
		log.Println("Nenhum usuário normal encontrado para exibir no dashboard admin")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Nenhum usuário admin encontrado", "details": err.Error()})
		return
	}

	masterUsers, err := uh.UserService.ListUsersByRole(models.Master)
	if err != nil {
		log.Println("Nenhum usuário master encontrado para exibir no dashboard master")
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Nenhum usuário master encontrado", "details": err.Error()})
		return
	}

	data := gin.H{
		"Navbar":  true,
		"Title":   "Perfil do Usuário - Gera Boleto Especialização - UESPI",
		"User":    user,
		"Normals": normalUsers,
		"Masters": masterUsers,
	}
	c.HTML(http.StatusOK, "perfil", data)
}

func (uh *UserHandler) RefreshUsers(c *gin.Context) {
	masters, _ := uh.UserService.ListUsersByRole(models.Master)
	normals, _ := uh.UserService.ListUsersByRole(models.Normal)

	user, err := uh.UserService.GetUser(c)
	if err != nil {
		log.Println("Erro ao obter usuário:", err)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.HTML(http.StatusOK, "usersTablesPartial", gin.H{
		"Masters": masters,
		"Normal":  normals,
		"User":    user,
	})
}
