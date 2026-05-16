package router

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/shenikar/theme-match/backend/internal/handler"
)

// SetupRouter настраивает Gin-маршрутизатор и регистрирует все маршруты.
func SetupRouter(themeHandler *handler.ThemeHandler) *gin.Engine {
	r := gin.Default()

	// Настройка CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Разрешить запросы со всех доменов (для разработки)
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Группировка маршрутов API
	api := r.Group("/")
	{
		api.GET("/themes", themeHandler.GetThemes)
		api.POST("/vote", themeHandler.PostVote)
		api.GET("/result", themeHandler.GetResult)
		api.POST("/start-new-test", themeHandler.StartNewTest)
	}

	return r
}
