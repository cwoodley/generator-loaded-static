'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;


var LoadedEdmGenerator = module.exports = function LoadedEdmGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LoadedEdmGenerator, yeoman.generators.Base);

LoadedEdmGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
  {
    name: 'projectName',
    message: 'What is the name of this project?'
  },
  {
    name: 'authorName',
    message: 'Who created this project?'
  },
  {
    name: 'authorEmail',
    message: 'What is your email address prefix? e.g yourname@...'
  },
  {
    type: 'confirm',
    name: 'createGit',
    message: 'Would you like to initialise this as a git repository?',
    default: false
  }
  ];

  this.prompt(prompts, function (props) {
    this.authorName = props.authorName;
    this.projectName = props.projectName;
    this.authorEmail = props.authorEmail;
    this.createGit = props.createGit;

    cb();
  }.bind(this));
};

LoadedEdmGenerator.prototype.app = function app() {
  this.mkdir('source');
  this.mkdir('source/images');

  this.copy('gitignore', '.gitignore');
  this.template('_package.json', 'package.json');
  this.copy('_gruntfile.js', 'Gruntfile.js');
  this.template('_index.html', './source/index.html');
};

LoadedEdmGenerator.prototype.git = function git() {
  if (this.createGit) {
    exec('git init && git add . && git commit -am "initial commit"', function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
    });
    
    console.log("Git repo initialized.");

  }
}

// LoadedEdmGenerator.prototype.projectfiles = function projectfiles() {
//   this.copy('editorconfig', '.editorconfig');
//   this.copy('jshintrc', '.jshintrc');
// };
