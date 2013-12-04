'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var chalk   = require('chalk');

var LoadedStaticGenerator = module.exports = function LoadedStaticGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LoadedStaticGenerator, yeoman.generators.Base);

LoadedWpThemeGenerator.prototype.initGenerator = function () {
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
    default: false
  }, {
    type: 'confirm',
    name: 'installCSS',
    message: 'Would you like to install a CSS framework?',
    default: true
  },{
      type: 'list',
      name: 'whichCSS',
      message: 'Which CSS framework would you like to start with?',
      choices: [
        {
          name: "Bourbon + Neat",
          value: "bourbon_neat"
        },
        {
          name: "Bourbon",
          value: "bourbon"
        }
      ],
      when: function (props) {
        return props.installCSS;
      }
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
    this.whichCSS = getFrameworkChoice(props);

    cb();
  }.bind(this));
};

function getFrameworkChoice(props) {
  var choices = props.whichCSS;

  if(choices.indexOf('bourbon') !== -1) {
    return 'bourbon';
  }
  
  if(choices.indexOf('bourbon_neat') !== -1) {
    return 'bourbon_neat';
  }
}

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


  this.copy('gitignore', '.gitignore');
  this.copy('404.html', '/source/404.html');
  this.template('_package.json', 'package.json');
  this.template('_gruntfile.js', 'Gruntfile.js');
  this.template('_index.html', './source/index.html');

  this.log.info("Files copied!");

  cb();
};

LoadedStaticGenerator.prototype.git = function git() {
  if (this.createGit) {
    exec('git init && git add . && git commit -am "initial commit"', function (error, stdout, stderr) {
      if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
      }
    });
    
    self.log.ok("Git repo initialized.");

  }
}

LoadedStaticGenerator.prototype.installCssFrameworks = function installCssFrameworks() {
  if(this.frameworkSelected == 'bourbon') {
    var cb   = this.async(), self = this;

    this.log.writeln(chalk.cyan('=> ') + chalk.white("Installing Bourbon"));

    var child = exec('bourbon install --path source/assets/stylesheets/sass/',
      function (error, stdout, stderr) {
        if (error) {
          self.log.writeln(chalk.red('=> Installation Error!'));
          console.log(error.stack);
          console.log('Error code: '+error.code);
          console.log('Signal received: '+error.signal);
        } else {
          self.log.ok("Bourbon installed");
          cb();
        }
      }
    );
  }
  if(this.frameworkSelected == 'bourbon_neat') {
    var cb   = this.async(), self = this;

    this.log.writeln(chalk.cyan('=> ') + chalk.white("Installing Bourbon & Neat"));

      var child = exec('bourbon install --path source/assets/stylesheets/sass/ && cd source/assets/stylesheets/sass/ && neat install',
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
}

LoadedStaticGenerator.prototype.donezo = function donezo() {
  this.log(chalk.bold.green('\n------------------------\n\n\nAll Done!!\n'), {logPrefix: ''});
  this.log(chalk.bold("Local:")+"       "+chalk.underline("http://localhost/" + this.themeName));
  this.log(chalk.bold("Projects:")+"    "+chalk.underline("http://projects.loadedcommunications.com.au/" + this.themeName));
};

// LoadedStaticGenerator.prototype.projectfiles = function projectfiles() {
//   this.copy('editorconfig', '.editorconfig');
//   this.copy('jshintrc', '.jshintrc');
// };
