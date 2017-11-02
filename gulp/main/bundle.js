require('../misc/dependencies.js')();

/* -----  Start Tasks for Main Website Styling ----- */

/* Main.css */

gulp.task('clean_bundle', (done) => {
    clean([appRoot.path + config.app.paths.dist + 'styles']);
    done();
});

gulp.task('sass_autoprefixer_bundle', (done) => {
    run_sass_autoprefixer([appRoot.path + config.app.paths.styles + '/main.scss'] // Source
        , appRoot.path + config.app.paths.dist + 'styles' // Destination
        , { "outputStyle": "compressed" } // Sass
        , { "browsers": ['last 10 versions'], "cascade": false } // Autoprefixer Config
    );
    done();
});

gulp.task('pushSytles', (done) => {
    setTimeout(function() {
        uploadStyles();
    }, 2000); // Timeout just to be sure everything has finished to be written
    done();
});

function styles_bundle(done) {
    gulp.series('sass_autoprefixer_bundle', 'pushSytles', () => {
        done();
    })();
}

gulp.task('pushScripts', (done) => {
    setTimeout(function() {
        uploadScripts();
    }, 500);
    done();
});

gulp.task('obfuscate', (done) => {
    obfuscate(appRoot.path + config.app.paths.scripts + '/**/*.js', appRoot.path + config.app.paths.dist + '/scripts');
    done();
});

gulp.task('uglify', (done) => {
    run_uglify(appRoot.path + config.app.paths.scripts + '**/*.js', appRoot.path + config.app.paths.dist + 'scripts');
    done();
});

function scripts_bundle(done) {
    gulp.series('uglify', 'pushScripts', () => {
        done();
    })();
}

gulp.task('production', () => {
    gulp.series('obfuscate', 'pushScripts', () => {
        done();
    })();
});

gulp.task('watch:scripts', () => {
    gulp.watch(appRoot.path + config.app.paths.scripts + '**/*.js', scripts_bundle);
});

gulp.task('watch:styles', () => {
    gulp.watch(appRoot.path + config.app.paths.styles + '**/*.scss', styles_bundle);
});

gulp.task('watch', gulp.parallel(
    'watch:scripts', 'watch:styles'
));

gulp.task('default', gulp.parallel('watch'));
