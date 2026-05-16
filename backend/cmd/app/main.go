package main

import (
	"log"

	"github.com/shenikar/theme-match/backend/internal/handler"
	"github.com/shenikar/theme-match/backend/internal/repository"
	"github.com/shenikar/theme-match/backend/internal/router"
	"github.com/shenikar/theme-match/backend/internal/service"
)

func main() {
	// Инициализация репозитория тем (хранение в памяти)
	themeRepo := repository.NewThemeRepository()

	// Инициализация сервиса тем с репозиторием
	themeService := service.NewThemeService(themeRepo)

	// Инициализация обработчика тем с сервисом
	themeHandler := handler.NewThemeHandler(themeService)

	// Настройка Gin-маршрутизатора
	r := router.SetupRouter(themeHandler)

	// Запуск сервера Gin
	if err := r.Run(":8081"); err != nil {
		log.Fatalf("не удалось запустить сервер: %v", err)
	}
}
