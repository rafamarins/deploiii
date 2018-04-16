/* ----- Common Functions ----- */

module.exports = function () {
  this.run_sass_autoprefixer = function (src, destination, autoprefixerConfig, cssnanoConfig) {
    var plugins = [
      this.postcssnormalize,
      this.autoprefixer(autoprefixerConfig),
      this.cssnano(cssnanoConfig)
    ]
    this.pump([
      this.gulp.src(src),
      this.gulpif(this.config.app.input.compiler.styles.sass === true,
        this.sass().on('error', function (err) {
          this.gutil.log(this.gutil.colors.red('[Error]'), err.toString())
          this.emit('end')
          return false
        }),
        this.gulpif(this.config.app.input.compiler.styles.less === true,
          this.less().on('error', function (err) {
            this.gutil.log(this.gutil.colors.red('[Error]'), err.toString())
            this.emit('end')
            return false
          }),
          this.gulpif(this.config.app.input.compiler.styles.less === true,
            this.stylus().on('error', function (err) {
              this.gutil.log(this.gutil.colors.red('[Error]'), err.toString())
              this.emit('end')
              return false
            })
          )
        )
      ),
      this.postcss(plugins).on('error', function (err) {
        this.gutil.log(this.gutil.colors.red('[Error]'), err.toString())
        this.emit('end')
        return false
      }),
      this.rename(this.config.app.output.filename.css),
      this.gulp.dest(destination),
      this.touch() // For some reason, the output bundle wasn't updating its last modifed date, so add this to make sure if does that.
    ])
  }

  this.run_uglify = function (src, destination) {
    this.pump([
      this.gulp.src(['./node_modules/babel-polyfill/dist/polyfill.min.js', src]),
      this.sourcemaps.init(),
      this.gulpif(this.config.app.input.compiler.scripts.babel === true,
        this.babel().on('error', function (err) {
          this.gutil.log(this.gutil.colors.red('[Error]'), err.toString())
          this.emit('end')
          return false
        })
      ),
      this.concat(this.config.app.output.filename.scripts),
      this.strip(),
      this.gulp.dest(destination),
      this.gulpif(this.config.app.output.uglify === true,
        this.uglify().on('error', function (err) {
          this.gutil.log(this.gutil.colors.red('[Error]'), err.toString())
          this.emit('end')
          return false
        }),
        this.gulp.dest(destination)
      ),
      this.sourcemaps.write('./maps'),
      this.gulp.dest(destination)
    ])
  }

  this.obfuscate = function (src, destination) {
    this.pump([
      this.gulp.src(src),
      this.concat('bundle.js'),
      this.gulp.dest(destination),
      this.obfuscator({
        compact: true,
        sourceMap: true
      }).on('error', function (err) {
        this.gutil.log(this.gutil.colors.red('[Error]'), err.toString())
        this.emit('end')
        return false
      }),
      this.gulp.dest(destination)
    ])
  }

  function filepathExists (path) {
    if (this.fs.existsSync(path)) {
      return true
    } else {
      this.gutil.log(this.gutil.colors.red('[Error]'), "File doesn't exists, please verify your paths & files -> " + path)
      return false
    }
  }

  function push (globs, dest, styles) {
    var conn = this.ftp.create({
      host: this.config.ftp.host,
      user: this.config.ftp.user,
      password: this.config.ftp.password,
      port: this.config.ftp.port,
      parallel: 5,
      reload: true,
      secure: this.config.ftp.sftp,
      log: this.gutil.log
    })

    //  validates if parent folder path exists
    if (this.fs.existsSync(globs[0].substring(0, globs[0].lastIndexOf('/')))) {
      // turn off buffering in gulp.src for best performance
      return this.pump([
        this.gulp.src(globs, { cwd: '/', buffer: false }), //
        conn.newerOrDifferentSize(dest), // only upload newer files
        conn.dest(dest), //
        this.notify({
          message: 'Finished deployment.',
          onLast: true
        })
      ])
    } else {
      this.gutil.log(this.gutil.colors.red('[Error]'), "Dist file doesn't exists, please verify your paths & files -> " + globs[0])
      return null
    }
  }

  this.uploadStyles = function () {
    var base = this.config.ftp.base
    var rootDist = this.appRoot.path + this.config.app.paths.dist

    var globs = [
      rootDist + this.config.app.watch.styles
    ]

    push(globs, base, true)
  }

  this.uploadScripts = function () {
    var base = this.config.ftp.base
    var rootDist = this.appRoot.path + this.config.app.paths.dist

    var globs = [
      rootDist + this.config.app.watch.scripts
    ]

    push(globs, base, false)
  }

  this.clean = function (path) {
    this.del(path)
  }
}
