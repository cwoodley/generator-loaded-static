# generator-loaded-static
A generator for [Yeoman](http://yeoman.io) to bootstrap a new static website project.


## Requirements

- Node.js
- NPM
- Yeoman

## Installation

1. Download or clone the generator from the [bitbucket repository](https://bitbucket.org/loadedcom/generator-loaded-static):  
```
	https://bitbucket.org/loadedcom/generator-loaded-static/get/master.zip
```

2. Move the extracted directory to any location for safekeeping, then ` cd ` to it.
 
3. Run ` npm link `

4. Create a new directory for your project, anywhere on your system e.g  
	```
	mkdir myProject && cd myProject
	```
5. Run the generator: ` yo loaded-static `


## Usage

Run ` grunt watch ` while working on your project.

Run ` grunt build ` to create a deliverable archive of the project **OR** ` grunt nozip ` to run the build process WITHOUT creating a zip file (useful for checking etc)

### Other Grunt Tasks

` clean ` - Create a new, empty **build/** directory  
` copy ` - Copy necessary project files to **build/**  
` imagemin ` - Create compressed copies of image files to **build/**.  
` compress ` - Create a named & versioned zip file of the contents of build inside **dist/** directory e.g projectname-build_ddmmHHMM.zip  


## TODO items
* Add _components.scss, _variables.scss, _utilities.scss


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)