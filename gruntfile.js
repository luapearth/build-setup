module.exports = function( grunt ) {

  var config = {
    app: 'app',
    assets: 'assets',
    views: 'views',
    dist: 'dist',
    tmp: '.tmp'
  };

  grunt.initConfig({
    config: config,

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.assets %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%= config.tmp %>/styles',
          ext: '.min.css'
        }]
      }
    },

    jade: {
      dist: {
        options: {
          client: false,
          pretty: true,
        },
        files: [{
          expand: true,
          cwd: '<%= config.views %>',
          src: ['*.jade', '!layouts/*.jade', '!includes/*.jade'],
          dest: '<%= config.app %>',
          ext: '.html'
        }]
      }
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: ['{,*/}*.html'],
          dot: true,
          dest: '<%= config.dist %>'
        }]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= config.assets %>/images',
          src: ['{,*/}*.{jpg,jpeg,gif,png,svg}'],
          dest: '<%= config.app %>/images'
        }]
      }
    },

    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: ['<%= config.app %>/*.html']
    },

    usemin: {
      options: {
        assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images', '<%= config.dist %>/scripts', '<%= config.dist %>/styles']
      },
      html: ['<%= config.dist %>/{,*/}*.html']
    },

    filerev: {
      dist: {
        src: [
          '<%= config.dist %>/scripts/{,*/}*.js',
          '<%= config.dist %>/styles/{,*/}*.css',
          '<%= config.dist %>/images/{,*/}*.*',
          '<%= config.dist %>/*.{ico.png}'
        ]
      }
    },

    wiredep: {
      app: {
        src: ['<%= config.views %>/layouts/layout.jade'],
        ignorePath: /^(\.\.\/)*\.\./
      },
      sass: {
        src: ['<%= config.assets %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /^(\.\.\/)+/
      }
    },

    clean: {
      dist: ['./app', './dist']
    },

    browserSync: {
      options: {
        notify: false,
        background: true,
        watchOptions: {
          ignored: ''
        }
      },
      livereload: {
        options: {
          files: [
            '<%= config.app %>/{,*/}*.html',
            '<%= config.tmp %>/styles/{,*/}*.css',
            '<%= config.tmp %>/scripts/{,*/}*.js'
          ],
          port: 9000,
          server: {
            baseDir: ['<%= config.tmp %>', '<%= config.app %>'],
            routes: {
              '/bower_components': './bower_components'
            }
          }
        }
      }
    },

    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.assets %>/scripts',
          src: ['{,*/}*.js', '!*.min.js'],
          dest: '<%= config.tmp %>/scripts',
          ext: '.min.js'
        }]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true, 
          cwd: '<%= config.assets %>/images',
          src: '{,*/}*.{jpg,jpeg,gif,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.assets %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    watch: {
      sass: {
        files: ['<%= config.assets %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass']
      },
      jade: {
        files: ['<%= config.views %>/{,*/}*.jade'],
        tasks: ['jade']
      },
      babel: {
        files: ['<%= config.assets %>/scripts/{,*/}*.js'],
        tasks: ['babel']
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      }
    }

  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-filerev');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin'); 
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('serve', ['wiredep', 'jade', 'sass', 'babel', 'copy:images', 'browserSync:livereload', 'watch']);

  grunt.registerTask('build', [
    'clean',
    'jade',
    'copy:dist',
    'babel',
    'sass',
    'imagemin',
    'svgmin',
    'useminPrepare',
    'concat:generated',
    'cssmin:generated',
    'uglify:generated',
    'filerev',
    'usemin'
  ]);

};
