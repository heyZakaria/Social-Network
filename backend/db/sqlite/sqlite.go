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
	_, err = DB.Exec("PRAGMA journal_mode=WAL;")
	if err != nil {
		log.Fatalf("Failed to enable WAL mode: %v", err)
	}

	initMig()
	return DB, nil
}

func initMig() error {
	fmt.Println("Running initMig...")
	fmt.Println("Running initMig...")

	files, err := filepath.Glob("db/sqlite/migrations/*.up.sql") // أو migrations/*.up.sql حسب الحل
	if err != nil {
		fmt.Println("Glob error:", err)
	}
	fmt.Println("MIG FILES:", files)

	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	migrationsPath := filepath.Join(dir, "db/migration")
	DatabasePath := filepath.Join(dir, "db/sqlite/database.db")

	fmt.Println("Migrations path:", migrationsPath)
	fmt.Println("Database path:", DatabasePath)

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
