'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
        'Welcome to the lovely ' + chalk.red('Go Angular Typescript') + ' generator!'
    ));

    this.prompt({
        type: 'input',
        name: 'name',
        message: 'Your project name',
        //Defaults to the project's folder name if the input is skipped
        default: this.appname
    }, function(answers) {
        this.props = answers
        this.log(answers.name);
        done();
    }.bind(this));
   },

  writing: function () {
    this.fs.copy(
      this.templatePath('app'),
      this.destinationPath('app')
    );
    this.fs.copy(
      this.templatePath('assets'),
      this.destinationPath('assets')
    );
    this.fs.copy(
      this.templatePath('dist'),
      this.destinationPath('dist')
    );
    this.fs.copy(
      this.templatePath('tools'),
      this.destinationPath('tools')
    );
    this.fs.copy(
      this.templatePath('bower.json'),
      this.destinationPath('bower.json')
    );
    this.fs.copy(
      this.templatePath('gulp.config.js'),
      this.destinationPath('gulp.config.js')
    );
    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js')
    );
    this.fs.copy(
      this.templatePath('index.html'),
      this.destinationPath('index.html')
    );
    this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'), {
            name: this.props.name
        }
    );
    this.fs.copy(
      this.templatePath('ReadMe.md'),
      this.destinationPath('ReadMe.md')
    );
    this.fs.copy(
      this.templatePath('tsd.json'),
      this.destinationPath('tsd.json')
    );
    this.fs.copy(
      this.templatePath('tslint.json'),
      this.destinationPath('tslint.json')
    );
  },

  install: function () {
    this.installDependencies();
  }
});
