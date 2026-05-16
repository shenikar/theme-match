package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shenikar/theme-match/backend/internal/model"
	"github.com/shenikar/theme-match/backend/internal/service"
)

// ThemeHandler обрабатывает HTTP-запросы, связанные с темами.
type ThemeHandler struct {
	service *service.ThemeService
}

// NewThemeHandler создает и инициализирует новый ThemeHandler.
func NewThemeHandler(s *service.ThemeService) *ThemeHandler {
	return &ThemeHandler{service: s}
}

// GetThemes возвращает все доступные темы.
// @Summary Получить список тем
// @Description Возвращает список всех доступных тем VS Code.
// @Tags themes
// @Accept json
// @Produce json
// @Success 200 {array} model.Theme
// @Router /themes [get]
func (h *ThemeHandler) GetThemes(c *gin.Context) {
	themes := h.service.GetAllThemes()
	c.JSON(http.StatusOK, themes)
}

// PostVote принимает голос пользователя за тему.
// @Summary Отправить голос за тему
// @Description Регистрирует голос пользователя за указанную тему.
// @Tags themes
// @Accept json
// @Produce json
// @Param voteRequest body model.VoteRequest true "Запрос на голосование"
// @Success 200 {object} map[string]string "status: ok"
// @Failure 400 {object} map[string]string "error: message"
// @Router /vote [post]
func (h *ThemeHandler) PostVote(c *gin.Context) {
	var req model.VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	h.service.VoteForTheme(req.ThemeID)
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// GetResult возвращает результаты теста: лучшую тему и альтернативные рекомендации.
// @Summary Получить результат теста
// @Description Возвращает лучшую тему и список альтернативных тем по результатам голосования.
// @Tags themes
// @Accept json
// @Produce json
// @Success 200 {object} object "bestTheme: model.ThemeScore, alternativeThemes: []model.ThemeScore"
// @Router /result [get]
func (h *ThemeHandler) GetResult(c *gin.Context) {
	alternativeThemes, bestTheme := h.service.GetResult()
	c.JSON(http.StatusOK, gin.H{
		"bestTheme":       bestTheme,
		"alternativeThemes": alternativeThemes,
	})
}

// StartNewTest сбрасывает все оценки и начинает новый тест.
// @Summary Начать новый тест
// @Description Сбрасывает все накопленные оценки тем, чтобы начать новый раунд сравнений.
// @Tags themes
// @Accept json
// @Produce json
// @Success 200 {object} map[string]string "status: ok"
// @Router /start-new-test [post]
func (h *ThemeHandler) StartNewTest(c *gin.Context) {
	h.service.StartNewTest()
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
