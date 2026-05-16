package model

// Theme представляет тему VS Code.
type Theme struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// VoteRequest представляет тело запроса для голосования за тему.
type VoteRequest struct {
	ThemeID string `json:"themeId"`
}

// ThemeScore представляет тему с ее накопленным баллом.
type ThemeScore struct {
	ID    string `json:"id"`
	Score int    `json:"score"`
}
