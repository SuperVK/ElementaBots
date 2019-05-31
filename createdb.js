const db = require('better-sqlite3')('db.sqlite')

db.prepare(`CREATE TABLE "users" (
	"id"	TEXT NOT NULL UNIQUE,
	"items"	TEXT,
	"heroes"	TEXT,
	"guildid" 	TEXT,
	PRIMARY KEY("id")
)`).run()

db.prepare(`CREATE TABLE "guilds" (
	"leaderid"	TEXT,
	"gold" INT,
	"crystals" INT,
	"amulets" INT,
	"members"	TEXT,
	"id"	TEXT NOT NULL UNIQUE,
	"name" TEXT,
	PRIMARY KEY("id")
)`).run()
