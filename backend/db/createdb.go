package db

import (
	"database/sql"
	"os"
	"socialNetwork/utils"
)
var DB *sql.DB
func CreateDatabase() error {
	var err error
	DB, err = sql.Open("sqlite3", "../database/database.db")
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
	utils.Log("INFO", "Pinging database...")

	schema, err := os.ReadFile("../database/migrations/schema.sql")
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
