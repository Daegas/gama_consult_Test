# gama_consult_Test
Test reporitory for Gama Consult Project

## About Dependencies
* express: Express is related to Node as JQuery is related to JS
* express-handlebars: vew engine for Express (makes html less verbose, similar to Angular sintaxys)
* express-session: session management for Express. Sessions are for save data on service memory
* mysql: npm module to set DB connection
* express-mysql-session: module to store DB sessions, very useful on Production
* morgan: displays logs to know what the client has ask to the server (http requests)
* - bcryptjs: password encription
* - passport: user authentication
* - passport-local: user authenticaton through DB
* - timeago.js: time-data format
* connect-flash: user feedback - display error and success messages-
* express-validator: validate client data

## About DevDependencies    
    - Dependencies which are not need in Production but in Development
* nodemon

# Project Organization
    At the very beginning:
    * index.js: App starting file
    * database.js: DB settings and connection
    * keys.js: all secret data
    * lib/
    * public/
    * routes/
    * views/