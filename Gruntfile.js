module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      codemirror: {
        options: {
          compress: true,
          warnings: false
        },
        files: {
          'build/pub/js/codemirror.js': 
            ['components/codemirror/lib/codemirror.js', 
             'src/codemirror/dide/dide.js',
             'components/codemirror/addon/selection/active-line.js'],
          
        }
      },
      debug: {
        options: {
          beautify: true,
          mangle: false,
          sourceMap: true,
          sourceMapIncludeSources : true
        },
        files: {
          'build/pub/js/emu-dide.js': ['src/app/**/*.js']
        }
      },
      release: {
          options: {
              compress: true
          },
          files: {
              'build/pub/js/emu-dide.js' : ['src/app/**/*.js']
          }
      }
    },

    copy: {
        resources: {
          files: {
            'build/pub/js/underscore.js': ['components/underscore/underscore.js'],
            'build/pub/js/bootstrap.js': ['components/bootstrap/dist/js/bootstrap.js'],
            'build/pub/js/jquery.js': ['components/jquery/dist/jquery.js'],
            'build/pub/css/bootstrap.css': ['components/bootstrap/dist/css/bootstrap.css'],
            'build/pub/css/codemirror.css' : ['components/codemirror/lib/codemirror.css'],
            'build/emu-dide.html': ['src/view/index.html'],
            'build/pub/css/emu-dide.css': ['src/view/css/emu-dide.css'],
            'build/pub/img/logo.png': ['src/view/img/logo.png'],
            'build/pub/img/login-btn-edge.png': ['src/view/img/login-btn-edge.png']
          }
        },
        services: {
            cwd: 'src/services',
            src: '**/*',
            dest: 'build/',
            expand: true
        },
        db: {
            files : {
                'build/db/emudide.sqlite' : ['misc/emudide.sqlite']
            }
        },
        htaccess: {
            files: {
                'build/.htaccess' : ['misc/root.htaccess'],
                'build/model/.htaccess' : ['misc/forbid.htaccess'],
                'build/flight/.htaccess' : ['misc/forbid.htaccess'],
                'build/db/.htaccess' : ['misc/forbid.htaccess']
        }
        }
    },

    php: {
      services: {
        options:{
          port: 1337,
          base: 'build',
          hostname: 'localhost',
        }
      }
    },

    watch: {
      files: ['src/**/*.js', 'src/**/*.html', 'src/**/*.css', 'src/**/*.php'],
      tasks: ['jshint:all', 'uglify:debug', 'copy:debug', 'copy:services'],
      options : {
        livereload: true
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js']
    },

    clean: ['build']

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-php');
  grunt.registerTask('build-debug', ['jshint:all','uglify:debug', 'uglify:codemirror', 'copy:resources', 'copy:services', 'copy:db']);
  grunt.registerTask('build', ['jshint:all', 'uglify:release', 'uglify:codemirror', 'copy:resources', 'copy:services', 'copy:db', 'copy:htaccess']);
  grunt.registerTask('debug-serve', ['build', 'php:services', 'watch']);
  grunt.registerTask('default', ['clean']);
};