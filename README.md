# Deploiii

Small basic Node + Gulp framework to compile SASS & Uglify scripts and finally upload to server via FTP

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

All the packages below are required. Just install them with NPM

```
app-root-path
del
gulp - "github:gulpjs/gulp#4.0" *IMPORTANT, THIS PROJECT RUNS ON GULP 4.0, IT WON'T WORK ON EARLIER VERSIONS
gulp-autoprefixer
gulp-util
gulp-concat
gulp-javascript-obfuscator
gulp-notify
gulp-rename
gulp-sass
gulp-uglify
gulp-watch
pump
require-dir
vinyl-ftp
```

### Installing

A step by step series of examples that tell you have to get a development env running

```
Copy all files to your project. 
Keep in mind of package.json file which contains most of the packages used in this project.
```

## Running

Simply run

```
gulp
```
or use node tasks
```
npm run watch
```

## Deployment

Once you have a final version for your scripts, you can obfuscate them by running the obfuscate task

```
gulp obfuscate
```

## Authors

* **Rafael Marins** - *Initial work* - [Deploiii](https://github.com/rafamarins)
