'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var chalk   = require('chalk');
var slugify   = require('slugify');
    var globalConfig = {
        source: './source',
        build: './build/source',
        assets: './source/assets'
    };

var LoadedStaticGenerator = module.exports = function LoadedStaticGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LoadedStaticGenerator, yeoman.generators.Base);

LoadedStaticGenerator.prototype.initGenerator = function () {
  this.log([
chalk.yellow('      :::        ::::::::       :::      :::::::::   ::::::::::  :::::::::'),
chalk.yellow('     :+:       :+:    :+:    :+: :+:    :+:    :+:  :+:         :+:    :+:'),
chalk.yellow('    +:+       +:+    +:+   +:+   +:+   +:+    +:+  +:+         +:+    +:+'),
chalk.yellow('   +#+       +#+    +:+  +#++:++#++:  +#+    +:+  +#++:++#    +#+    +:+'),
chalk.yellow('  +#+       +#+    +#+  +#+     +#+  +#+    +#+  +#+         +#+    +#+'),
chalk.yellow(' #+#       #+#    #+#  #+#     #+#  #+#    #+#  #+#         #+#    #+#'),
chalk.yellow('########## ########   ###     ###  #########   ##########  ######### ')
  ].join('\n'));

  this.log.writeln(chalk.cyan('=> ') + chalk.white('Intializing Static Site Generator v'+this.pkg.version));
};

LoadedStaticGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
  {
    name: 'projectName',
    message: 'What is the name of this project?',
    default: "test"
  },
  {
    name: 'authorName',
    message: 'Who created this project?',
    default: "Cale Woodley"
  },
  {
    name: 'authorEmail',
    message: 'What is your email address prefix? e.g yourname@...',
    default: "cale"
  },
  {
    type: 'confirm',
    name: 'createGit',
    message: 'Would you like to initialise this as a git repository?',
    default: true
  }, {
    type: 'confirm',
    name: 'installCSS',
    message: 'Would you like to install a CSS framework?',
    default: true
  }, {
    name: 'devBrowser',
    type: 'list',
    message: 'What is your development browser?',
    default: 1,
    choices: [
      "Google Chrome",
      "Google Chrome Canary",
      "Firefox",
      "Safari"
    ]
  }
  ];

  this.prompt(prompts, function (props) {
    this.authorName = props.authorName;
    this.projectName = props.projectName;
    this.authorEmail = props.authorEmail;
    this.createGit = props.createGit;
    this.installCSS = props.installCSS;
    this.devBrowser = props.devBrowser;

    cb();
  }.bind(this));
};

LoadedStaticGenerator.prototype.app = function app() {
    var cb   = this.async()
  , self = this

  this.log.writeln(chalk.cyan('=> ') + chalk.white('Copying starter files.'));

  this.mkdir('source');
  this.mkdir('source/assets/images/');
  this.mkdir('source/assets/images/sprites/');
  this.mkdir('source/assets/stylesheets/sass/');
  this.mkdir('source/assets/stylesheets/css/');
  this.mkdir('source/assets/javascripts/');
  this.mkdir('source/assets/vendor/');

  this.copy('javascripts/presentation.js','./source/assets/javascripts/presentation.js');
  this.copy('stylesheets/sass/styles.scss','./source/assets/stylesheets/sass/'+ slugify(this.projectName) +'.scss');
  this.copy('gitignore', '.gitignore');
  this.copy('404.html', './source/404.html');
  this.template('_package.json', 'package.json');
  this.template('_gruntfile.js', 'Gruntfile.js');
  this.template('_index.html', './source/index.html');

  cb();
};

LoadedStaticGenerator.prototype.git = function git() {
var cb   = this.async(), self = this;

  if (this.createGit) {
    this.log.writeln(chalk.cyan('=> ') + chalk.white('Initialising Git repository.'));
    exec('git init && git add . && git commit -am "initial commit"', function (error, stdout, stderr) {
      if (error) {
        self.log.writeln(chalk.red('=> Git Initialisation Error!'));
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
    });
    
    self.log.ok("Git repo initialized.");
    cb();
  }
}

LoadedStaticGenerator.prototype.installCssFrameworks = function installCssFrameworks() {
    var cb   = this.async(), self = this;

    this.log.writeln(chalk.cyan('=> ') + chalk.white("Installing Bourbon & Neat"));

      var child = exec('bourbon install --path ./source/assets/stylesheets/sass/ && cd ./source/assets/stylesheets/sass/ && neat install',
      function (error, stdout, stderr) {
        if (error) {
          self.log.writeln(chalk.red('=> Installation Error!'));
          console.log(error.stack);
          console.log('Error code: '+error.code);
          console.log('Signal received: '+error.signal);
        } else {
          self.log.ok("Bourbon & Neat installed");
          cb();
        }
      });
}

LoadedStaticGenerator.prototype.donezo = function donezo() {
  this.log(chalk.bold.green('\n\n------------------------\n\n\nAll Done!!\n'), {logPrefix: ''});
  this.log(chalk.bold("Local:")+"       "+chalk.underline("http://localhost/" + slugify(this.projectName) + "/source/"));
  this.log(chalk.bold("Projects:")+"    "+chalk.underline("http://projects.loadedcommunications.com.au/" + slugify(this.projectName) + "/source/"));
};

// LoadedStaticGenerator.prototype.projectfiles = function projectfiles() {
//   this.copy('editorconfig', '.editorconfig');
//   this.copy('jshintrc', '.jshintrc');
// };
