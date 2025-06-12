package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"socialNetwork/utils"

	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"

	"github.com/golang-migrate/migrate/v4"
)

var DB *sql.DB

func InitDB(dataSourceName string) (*sql.DB, error) {
	var err error
	DB, err = sql.Open("sqlite3", dataSourceName)
	if err != nil {
		return nil, err
	}

	err = DB.Ping()
	if err != nil {
		return nil, err
	}

	_, err = DB.Exec("PRAGMA foreign_keys = ON")
	if err != nil {
		return nil, fmt.Errorf("failed to enable foreign keys: %w", err)
	}

	initMig()
	return DB, nil
}

func initMig() error {

	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	migrationsPath := filepath.Join(dir, "../db/migration")
	DatabasePath := filepath.Join(dir, "../db/sqlite/database.db")

	sourceURL := "file://" + migrationsPath
	dbURL := "sqlite3://" + DatabasePath

	m, err := migrate.New(sourceURL, dbURL)
	if err != nil {
		utils.Log("ERROR", "Migration init error "+err.Error())

		log.Fatal("Migration init error: ---", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatal("Migration up error: ", err)
	}
	utils.Log("INFO", "Migrations applied successfully!")

	return nil
}
