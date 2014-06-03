EMU-DIDE
========

This is the repository for our Web Dev class final project. Our goal is to provide an online assembler and 
emulator for the DIDE architecture as seen in our Architecture classes at Polytech Paris Sud. 

##Building the project

The build script must be run with Grunt, which in turn requires nodejs. Bower is also used for runtime dependencies management.

First, install nodejs using the installer available on the [official page](http://nodejs.org/). 

Next, install Grunt and Bower globally. 

```
npm install grunt-cli -g
npm install bower -g
```

Clone the repo using your favorite git client. You can then install the  dependencies by running the appropriate commands in the project directory.

```
npm install
bower install
```

To build the project, simply use Grunt's ``build'' multi-task. 

```
grunt build
```

The application will be built in the in the `build' directory,
ready to be deployed.


##Deployment

A PHP 5.4 compatible server is required for the server-side storage space to work, although the application can perfectly run
without it. 

Make sure that SQLite and its PDO driver are enabled in the PHP configuration.

###Dependencies

EMU-DIDE depends on the following JavaScript and CSS libraries:
 * jQuery
 * Bootstrap
 * Underscore.js
 * CodeMirror

The server side is built upon the [Flight Framework](http://flightphp.com/)
written by Mike Cao. Data persistence is done with an SQLite database.

##Directory Layout

```
/src/app             - Core JavaScript modules
/src/codemirror/     - Contains the style mode for CodeMirror
/src/services/       - Server-side code for the member storage space
/src/services/model  - Business and DB logic for the server-side 
/src/services/flight - The Flight PHP framework 
/src/views/          - Front-end stuff, such as HTML, CSS and images
/components/         - Dependencies downloaded by Bower
```