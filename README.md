# civic_budget_app
> Application for proposing and voting projects

## Table of contents
* [General info](#general-info)
* [Screenshots](#screenshots)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General info
Civic budget application for users(proposing and voting) nad admins(comfirming) with logging panel.

## Screenshots
(/screenshot.png)

## Technologies
* React 15.4.0
* webpack 3.12.0
* webpack-dev-server 2.11.2
* react-router 3.0.3
* json-server 0.14.0

## Setup
* npm init (or npm install packages)

* npm install react-router@3.0.3 --save
* npm install webpack-dev-server@2.11.2 --save-dev
* npm install react@15.4.0 react-dom@15.4.0 --save
* npm i babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev
* npm install --save-dev babel-preset-stage-2

* ./node_modules/.bin/webpack-dev-server --hot
* http://localhost:3001/
* node_modules/.bin/json-server db.json --watch

* https://magdastrojwas.github.io/civic_budget_app/#/


## Features
List of features ready
* logging panel with validation
* main template with different menus for users and admins
* Propose component adds new projects to database
* Confirmation component changes projects' status in database
* Vote component adds votes and points to database

To-do list:
* md5
* Result componnent with diagram
* register

## Status
Project is: _in progress_


## Contact
Created by magdalena.strojwas@gmail.com - feel free to contact me!