/* ----- Common Functions ----- */

module.exports = function() {

    this.run_sass_autoprefixer = function(src, destination, sassConfig, autoprefixerConfig) {
        pump([
            gulp.src(src),
            sass({ outputStyle: sassConfig.outputStyle }).on('error', sass.logError),
            autoprefixer({
                browsers: autoprefixerConfig.browsers,
                cascade: autoprefixerConfig.cascade
            }),
            rename(config.app.outputfilename.css),
            gulp.dest(destination)
        ]);
    }

    this.run_uglify = function(src, destination) {
        pump([
            gulp.src(src),
            concat(config.app.outputfilename.scripts),
            gulp.dest(destination),
            uglify(),
            gulp.dest(destination)
        ]);
    }

    this.obfuscate = function(src, destination) {
        pump([
            gulp.src(src),
            concat('bundle.js'),
            gulp.dest(destination),
            obfuscator({
                compact: true,
                sourceMap: true,
            }),
            gulp.dest(destination)
        ]);
    }

    function push(globs, dest, styles) {

        var conn = ftp.create({
            host: config.ftp.host,
            user: config.ftp.user,
            password: config.ftp.password,
            port: config.ftp.port,
            parallel: 5,
            reload: true,
            secure: true,
            log: gutil.log
        });

        // turn off buffering in gulp.src for best performance
        return pump([
            gulp.src(globs, { cwd: '/', buffer: false }) //
            , conn.newerOrDifferentSize(dest) // only upload newer files
            , conn.dest(dest) //
            , notify({
                message: 'Finished deployment.',
                onLast: true
            })
        ]);
    }

    this.uploadStyles = function() {
        var base = config.ftp.base;
        var rootDist = appRoot.path + config.app.paths.dist;

        var globs = [
            rootDist + config.app.watch.styles
        ];

        push(globs, base, true);
    }

    this.uploadScripts = function() {
        var base = config.ftp.base;
        var rootDist = appRoot.path + config.app.paths.dist;

        var globs = [
            rootDist + config.app.watch.scripts
        ];

        push(globs, base, false);
    }

    this.clean = function(path) {
        del(path);
    }
}