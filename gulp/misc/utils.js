/* ----- Common Functions ----- */

module.exports = function() {
    this.run_sass_autoprefixer = function(src, destination, sassConfig, autoprefixerConfig) {
        var plugins = [
            postcssnormalize,
            autoprefixer,
            cssnano
        ];
        pump([
            gulp.src(src),
            sass().on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString())
                this.emit('end')
            }),
            postcss(plugins).on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString())
                this.emit('end')
            }),
            rename(config.app.outputfilename.css),
            gulp.dest(destination),
            touch() // For some reason, the output bundle wasn't updating its last modifed date, so add this to make sure if does that.
        ])
    }

    this.run_uglify = function(src, destination) {
        pump([
            gulp.src(src),
            concat(config.app.outputfilename.scripts),
            gulp.dest(destination),
            uglify().on('error', function(err) {
                gutil.log(gutil.colors.red('[Error]'), err.toString())
                this.emit('end')
            }),
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
            }),
            gulp.dest(destination)
        ])
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
    }

    this.uploadStyles = function() {
        var base = config.ftp.base;
        var rootDist = appRoot.path + config.app.paths.dist;

        var globs = [
            rootDist + config.app.watch.styles
        ]

        push(globs, base, true);
    }

    this.uploadScripts = function() {
        var base = config.ftp.base;
        var rootDist = appRoot.path + config.app.paths.dist;

        var globs = [
            rootDist + config.app.watch.scripts
        ]

        push(globs, base, false);
    }

    this.clean = function(path) {
        del(path);
    }
}