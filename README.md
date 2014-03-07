emu-dide
========

This is the repository for our Web Dev finals project. Our goal is to provide an online assembler and 
emulator for the DIDE architecture as seen in our Architecture classes at Polytech Paris Sud. 

##Building the project

The build system is based on grunt, which in turn require nodejs.

First, install nodejs using the installer avaiable on the [official site](http://nodejs.org/). 

Next, install Grunt and Bower globally. Bower is used for dependency management.

```
npm install grunt-cli -g
npm install bower -g
```

Clone the repository using your favorite git client. You can then install the additional dependancies by running the approriate command in the project repertory.

```
npm install
bower install
```

To build the project, simply use Grunt's build multi-task.

