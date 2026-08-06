package main

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/unitechio/eLearning/apps/api/pkg/compress"
)

type TestStruct struct {
	ID          uint
	Payload     compress.CompressedJSON
	Explanation compress.CompressedJSON `gorm:"type:bytea"`
	Text        compress.CompressedText
}

func main() {
	dialector := postgres.New(postgres.Config{
		DSN: "user=postgres dbname=postgres sslmode=disable",
	})
	db, _ := gorm.Open(dialector, &gorm.Config{})
	stmt := &gorm.Statement{DB: db}
	stmt.Parse(&TestStruct{})
	for _, field := range stmt.Schema.Fields {
		fmt.Printf("Field %s: DataType=%v, DBName=%s, DataTypeInPostgres=%s\n", field.Name, field.DataType, field.DBName, dialector.DataTypeOf(field))
	}
}
