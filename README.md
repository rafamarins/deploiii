# Deploiii

Small basic Node + Gulp framework to compile SASS & Uglify scripts and finally upload to server via FTP

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
Node is required.
You can download it from here
```
https://nodejs.org/en/
```

All the packages below are required.

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
Then install the packages
```
npm install
```
## Config

You'll need to add your specific configs in the files living the config folder. You can find a config-sample.json file there.
Edit as per required to your project.
```
- config
-- config-sample.json
```

*Important - You need to rename this file to config.json. The project will look for the config.json file for it's specific details.*

## Running - Deploying

Simply run

```
gulp
```
or use node tasks
```
npm run watch
```

Once the task is running your css/js files will be watched and on any updates the files will get compiled into the output bundle and then uploaded to the FTP.

## Extra Features

Once you have a final version for your scripts, you can obfuscate them by running the obfuscate task

```
gulp production
```
or use node tasks
```
npm run production
```

## Authors

* **Rafael Marins** - *Initial work* - [Deploiii](https://github.com/rafamarins)
