const db = require('better-sqlite3')('db.sqlite')

db.prepare(`CREATE TABLE "users" (
	"id"	TEXT NOT NULL UNIQUE,
	"items"	TEXT,
	"heroes"	TEXT,
	PRIMARY KEY("id")
)`).run()

db.prepare(`CREATE TABLE "guilds" (
	"leaderid"	TEXT,
	"members"	TEXT,
	"id"	TEXT,
	PRIMARY KEY("guildid")
)`).run()
