# Deploiii

Small basic Node + Gulp framework to compile SASS/LESS/STYLUS & ES6 scripts and optionally upload to server via FTP (FTP use based on Hubspot CMS needs, further actual deployment tools to be implemented)

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
Check package.json file
```

### Installing

A step by step series of examples that tell you have to get a development env running

```
Copy all files to your project. 
Keep in mind of package.json file which contains the packages used in this project.
```

Then install the packages
```
npm install
```
## Config

You'll need to add your specific configs in the file living the config folder. You can find a config-sample.json.txt file there for reference.
Edit as per required to your project.
```
- config
-- config-sample.json
```

## Running - Deploying

Simply run

```
npm run watch
```

Once the task is running your css/js files will be watched and on any updates the files will get compiled into the output bundle and then uploaded to the FTP.

## Extra Features

Once you have a final version for your scripts, you can obfuscate them by running the obfuscate task

```
npm run production
```

## Authors

* **Rafael Marins** - *Initial work* - [Deploiii](https://github.com/rafamarins)
