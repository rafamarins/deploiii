/* ----- Common Functions ----- */

module.exports = function() {
    this.run_sass_autoprefixer = function(src, destination, autoprefixerConfig, cssnanoConfig ) {
            var plugins = [
                postcssnormalize,
                autoprefixer(autoprefixerConfig),
                cssnano(cssnanoConfig)
            ];
            pump([
                gulp.src(src),
                sass().on('error', function(err) {
                    gutil.log(gutil.colors.red('[Error]'), err.toString())
                    this.emit('end')
                    return false;
                }),
                postcss(plugins).on('error', function(err) {
                    gutil.log(gutil.colors.red('[Error]'), err.toString())
                    this.emit('end')
                    return false
                }),
                rename(config.app.output.filename.css),
                gulp.dest(destination),
                touch() // For some reason, the output bundle wasn't updating its last modifed date, so add this to make sure if does that.
            ])
    }

    this.run_uglify = function(src, destination) {
            pump([
                gulp.src(['./node_modules/babel-polyfill/dist/polyfill.min.js',src]),
                sourcemaps.init(),
                gulpif(config.app.output.babelEnabled == true,
                    babel().on('error', function(err) {
                        gutil.log(gutil.colors.red('[Error]'), err.toString())
                        this.emit('end')
                        return false
                    })
                ),
                concat(config.app.output.filename.scripts),            
                strip(),
                gulp.dest(destination),           
                gulpif(config.app.output.uglifyEnabled == true, 
                    uglify().on('error', function(err) {
                        gutil.log(gutil.colors.red('[Error]'), err.toString())
                        this.emit('end')
                        return false 
                    }),
                    gulp.dest(destination)
                ),
                sourcemaps.write('./maps'),
                gulp.dest(destination)
            ])
    }

    this.obfuscate = function(src, destination) {
        pump([
            gulp.src(src),
            concat('bundle.js'),
            gulp.dest(destination),
            obfuscator({
                compact: true,
                sourceMap: true
            }).on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString())
                this.emit('end')
                return false
            }),
            gulp.dest(destination)
        ])
    }

    function filepathExists(path) {
        console.log(fs.existsSync(path));
        if (fs.existsSync(path)) {
            return true;
        } else {
            gutil.log(gutil.colors.red('[Error]'), "File doesn't exists, please verify your paths & files -> " + path);
            return false;
        }
    }

    function push(globs, dest, styles) {
        var conn = ftp.create({
            host: config.ftp.host,
            user: config.ftp.user,
            password: config.ftp.password,
            port: config.ftp.port,
            parallel: 5,
            reload: true,
            secure: config.ftp.sftp,
            log: gutil.log
        })

        //validates if parent folder path exists
        if (fs.existsSync(globs[0].substring(0, globs[0].lastIndexOf("/")))) {
            // turn off buffering in gulp.src for best performance
            return pump([
                gulp.src(globs, { cwd: '/', buffer: false }) //
                , conn.newerOrDifferentSize(dest) // only upload newer files
                , conn.dest(dest) //
                , notify({
                    message: 'Finished deployment.',
                    onLast: true
                })
            ])
        } else {
            gutil.log(gutil.colors.red('[Error]'), "Dist file doesn't exists, please verify your paths & files -> " + globs[0]);
            return null;
        }
    }

    this.uploadStyles = function() {
        var base = config.ftp.base
        var rootDist = appRoot.path + config.app.paths.dist

        var globs = [
            rootDist + config.app.watch.styles
        ]

        push(globs, base, true)
    }

    this.uploadScripts = function() {
        var base = config.ftp.base
        var rootDist = appRoot.path + config.app.paths.dist

        var globs = [
            rootDist + config.app.watch.scripts
        ]

        push(globs, base, false)
    }

    this.clean = function(path) {
        del(path)
    }
}