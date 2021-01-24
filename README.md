# Student Information System

A simple application to manage student information in schools and colleges.

## Requirements

- [NodeJS](https://nodejs.org)
- MySQL

## Installation

- Clone the repository
	```bash
	git clone https://github.com/amithm7/web-sis.git
	cd web-sis
	```
- Install dependencies:
	```bash
	npm install
	```
- Setup database:
	- Linux:
		- Login to mysql as root: `sudo mysql -u root`
		- Create user 'sisAPI':
			`CREATE USER 'sisAPI'@'localhost' IDENTIFIED BY 'password';`
		- Grant permissions to user on 'SIS' database:
			`GRANT ALL PRIVILEGES ON SIS . * TO 'sisAPI'@'localhost';`
		- Exit mysql client: `exit`
		- Create database and tables:
			```bash
			echo 'create database SIS;' | mysql -u sisAPI --password=password
			# Create Relational tables
			mysql --user=sisAPI --password=password SIS < db/relations.sql
			```
	- Windows:
		- Open MySQL Command-Line Client
		- Create user 'sisAPI':
			`CREATE USER 'sisAPI'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
		- Grant permissions to user on 'SIS' database:
			`GRANT ALL PRIVILEGES ON SIS . * TO 'sisAPI'@'localhost';`
		- Create database: `create database SIS;`
		- Select 'SIS database: `use SIS;`
		- Execute sql queries in 'db' folder of the project repo to create tables
		- Exit mysql client: `exit`
## Usage

Run app server:
```bash
node server.js
```
