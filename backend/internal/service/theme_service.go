package service

import (
	"github.com/shenikar/theme-match/backend/internal/model"
	"github.com/shenikar/theme-match/backend/internal/repository"
)

const (
	// NumberOfComparisons определяет количество сравнений в тесте.
	NumberOfComparisons = 10
	// NumberOfAlternativeThemes определяет количество альтернативных тем, которые будут показаны в результатах.
	NumberOfAlternativeThemes = 3
)

// ThemeService инкапсулирует бизнес-логику, связанную с темами.
type ThemeService struct {
	repo *repository.ThemeRepository
}

// NewThemeService создает и инициализирует новый ThemeService.
func NewThemeService(repo *repository.ThemeRepository) *ThemeService {
	return &ThemeService{repo: repo}
}

// GetAllThemes возвращает все доступные темы.
func (s *ThemeService) GetAllThemes() []model.Theme {
	return s.repo.GetThemes()
}

// GetRandomThemePair возвращает случайную пару тем для сравнения.
func (s *ThemeService) GetRandomThemePair() (model.Theme, model.Theme) {
	return s.repo.GetRandomThemes()
}

// VoteForTheme увеличивает оценку для выбранной темы.
func (s *ThemeService) VoteForTheme(themeID string) {
	s.repo.IncrementScore(themeID)
}

// GetResult возвращает лучшую тему и альтернативные рекомендации.
func (s *ThemeService) GetResult() ([]model.ThemeScore, model.ThemeScore) {
	return s.repo.GetTopThemes(NumberOfAlternativeThemes)
}

// StartNewTest сбрасывает все оценки тем, чтобы начать новый тест.
func (s *ThemeService) StartNewTest() {
	s.repo.ResetScores()
}
