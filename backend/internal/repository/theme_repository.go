package repository

import (
	"math/rand"
	"sort"
	"sync"
	"time"

	"github.com/shenikar/theme-match/backend/internal/model"
)

// ThemeRepository управляет темами и их оценками в памяти.
type ThemeRepository struct {
	themes []model.Theme
	scores map[string]int
	mu     sync.Mutex // Мьютекс для защиты одновременного доступа к оценкам
	seeded bool       // Флаг для гарантии однократного вызова rand.Seed
}

// NewThemeRepository создает и инициализирует новый ThemeRepository.
func NewThemeRepository() *ThemeRepository {
	repo := &ThemeRepository{
		themes: []model.Theme{
			// Темные темы
			{ID: "dracula", Name: "Dracula"},
			{ID: "onedarkpro", Name: "One Dark Pro"},
			{ID: "nord", Name: "Nord"},
			{ID: "githubdark", Name: "GitHub Dark"},
			{ID: "catppuccin", Name: "Catppuccin"},
			{ID: "nightowl", Name: "Night Owl"},
			// Светлые темы
			{ID: "githublight", Name: "GitHub Light"},
			{ID: "onelight", Name: "One Light"},
		},
		scores: make(map[string]int),
	}

	// Инициализируем все оценки тем на 0
	for _, theme := range repo.themes {
		repo.scores[theme.ID] = 0
	}
	return repo
}

// GetThemes возвращает все доступные темы.
func (r *ThemeRepository) GetThemes() []model.Theme {
	return r.themes
}

// IncrementScore увеличивает оценку для данной темы.
func (r *ThemeRepository) IncrementScore(themeID string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.scores[themeID]++
}

// GetThemeScores возвращает текущие оценки для всех тем.
func (r *ThemeRepository) GetThemeScores() []model.ThemeScore {
	r.mu.Lock()
	defer r.mu.Unlock()

	var themeScores []model.ThemeScore
	for id, score := range r.scores {
		themeScores = append(themeScores, model.ThemeScore{ID: id, Score: score})
	}
	return themeScores
}

// GetRandomThemes возвращает случайную пару тем для сравнения, исключая дубликаты.
func (r *ThemeRepository) GetRandomThemes() (model.Theme, model.Theme) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if !r.seeded {
		rand.New(rand.NewSource(time.Now().UnixNano()))
		r.seeded = true
	}

	// Убедимся, что есть как минимум две темы для выбора
	if len(r.themes) < 2 {
		return model.Theme{}, model.Theme{} // Или обрабатываем ошибку соответствующим образом
	}

	for {
		idx1 := rand.Intn(len(r.themes))
		idx2 := rand.Intn(len(r.themes))

		if idx1 != idx2 {
			return r.themes[idx1], r.themes[idx2]
		}
	}
}

// ResetScores сбрасывает все оценки тем на ноль.
func (r *ThemeRepository) ResetScores() {
	r.mu.Lock()
	defer r.mu.Unlock()

	for id := range r.scores {
		r.scores[id] = 0
	}
}

// GetTopThemes возвращает топ N тем на основе оценки и лучшую тему.
func (r *ThemeRepository) GetTopThemes(count int) ([]model.ThemeScore, model.ThemeScore) {
	r.mu.Lock()
	defer r.mu.Unlock()

	themeScores := make([]model.ThemeScore, 0, len(r.scores))
	for id, score := range r.scores {
		themeScores = append(themeScores, model.ThemeScore{ID: id, Score: score})
	}

	// Сортируем темы по оценке в порядке убывания
	sort.Slice(themeScores, func(i, j int) bool {
		return themeScores[i].Score > themeScores[j].Score
	})

	var bestTheme model.ThemeScore
	if len(themeScores) > 0 {
		bestTheme = themeScores[0]
	}

	// Возвращаем топ 'count' тем, или все, если их меньше 'count'
	if len(themeScores) > count {
		return themeScores[1 : count+1], bestTheme
	}
	// Если тем меньше, чем 'count', возвращаем все, кроме лучшей, в качестве альтернатив
	if len(themeScores) > 1 {
		return themeScores[1:], bestTheme
	}
	return []model.ThemeScore{}, bestTheme // Нет альтернатив, если 0 или 1 тема
}
