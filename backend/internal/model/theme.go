package model

// Theme represents a VS Code theme.
type Theme struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// VoteRequest represents the request body for voting for a theme.
type VoteRequest struct {
	ThemeID string `json:"themeId"`
}

// ThemeScore represents a theme with its accumulated score.
type ThemeScore struct {
	ID    string `json:"id"`
	Score int    `json:"score"`
}
