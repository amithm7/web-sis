# Student Information System

A simple application to manage student information in schools and colleges.

## Requirements

- [NodeJS](https://nodejs.org)
- MySQL

## Installation

> Instructions shown here for mysql linux version

- Create Database User 'sisAPI': (Login as root: `sudo mysql -u root`)
	- Create user: `CREATE USER 'sisAPI'@'localhost' IDENTIFIED BY 'password';`
	- Grant permissions to user on DB 'parkingMS': `GRANT ALL PRIVILEGES ON SIS . * TO 'sisAPI'@'localhost';`
- Setup application and database:
	```bash
	git clone https://github.com/amithm7/web-sis.git
	cd web-sis
	npm install
	echo 'create database SIS;' | mysql -u sisAPI --password=password
	# Create Relational tables
	mysql --user=sisAPI --password=password SIS < db/relations.sql
	```

## Usage

Run app server:
```bash
node server.js
```
