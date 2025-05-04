package db

import (
	"database/sql"
	"os"
	"path/filepath"
	"socialNetwork/utils"

	"runtime"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func CreateDatabase() error {
	var err error

	_, filename, _, _ := runtime.Caller(0)
	wd := filepath.Dir(filename)

	utils.Log("INFO", "Working dir: "+wd)

	dbPath := filepath.Join(wd, "..",  "database", "database.db")

	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		utils.Log("INFO", "Database file does not exist. It will be created.")
	}

	DB, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		utils.Log("ERROR", "Database connection error: "+err.Error())
		return err
	}
	utils.Log("INFO", "Database opened successfully")

	err = DB.Ping()
	if err != nil {
		utils.Log("ERROR", "Ping fail: "+err.Error())
		return err
	}
	utils.Log("INFO", "Pinging database successful.")

	schemaPath := filepath.Join(wd, "..", "database", "migrations", "schema.sql")

	schema, err := os.ReadFile(schemaPath)
	if err != nil {
		utils.Log("ERROR", "Cannot read schema file: "+err.Error())
		return err
	}
	utils.Log("INFO", "Reading schema from schema.sql")

	_, err = DB.Exec(string(schema))
	if err != nil {
		utils.Log("ERROR", "Cannot execute schema: "+err.Error())
		return err
	}
	utils.Log("INFO", "Schema executed successfully")

	return nil
}
