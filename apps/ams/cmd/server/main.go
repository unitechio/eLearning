package main

import (
	"net/http"

	"github.com/unitechio/eenglish/ams/internal/bootstrap"
	"github.com/unitechio/eenglish/ams/internal/config"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		panic(err)
	}

	app, err := bootstrap.BuildApplication(cfg)
	if err != nil {
		panic(err)
	}

	app.Logger.Info("server starting", "addr", app.Server.Addr)
	if err := app.Server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		app.Logger.Error("server error", "error", err.Error())
		panic(err)
	}
}
