emu-dide
========

This is the repository for our Web Dev class final project. Our goal is to provide an online assembler and 
emulator for the DIDE architecture as seen in our Architecture classes at Polytech Paris Sud. 

##Building the project

The build system is based on Grunt, which in turn requires nodejs. Bower is also used for runtime dependencies management.

First, install nodejs using the installer avaiable on the [official page](http://nodejs.org/). 

Next, install Grunt and Bower globally. 

```
npm install grunt-cli -g
npm install bower -g
```

Clone the repo using your favorite git client. You can then install the additional dependencies by running the appropriate commands in the project directory.

```
npm install
bower install
```

To build the project, simply use Grunt's ``build'' multi-task. The application will be built in the in the `build' directory.
Be sure to create the SQLite database in the db directory (default name 'emudide') before deploying.

