//------------------------------------------------------------------------------
// Dependencies
//------------------------------------------------------------------------------
var gulp = require('gulp');

var cache           = require('gulp-cached'),
    gulpif          = require('gulp-if'),
    imagemin        = require('gulp-imagemin'),
    notify          = require('gulp-notify'),
    plumber         = require('gulp-plumber'),
    sprity          = require('sprity');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

// Development URL
var siteName    = 'example-site',
    devUrl      = 'https://demo.example-site.com';

// Local file paths
var src     = 'source',
    dest    = 'dist';

//------------------------------------------------------------------------------
// Error handling
//------------------------------------------------------------------------------
function onError(error) {
    var errorTitle = '[' + error.plugin + ']',
        errorString = error.message;

    notify.onError({
        title:    errorTitle,
        message:  errorString,
        sound:    "Beep"
    })(error);
    this.emit('end');
}


//------------------------------------------------------------------------------
// Images task
//------------------------------------------------------------------------------
gulp.task('images', function() {
    return gulp.src(src + '/images/**/*')
    .pipe(plumber({errorHandler: onError}))

    // Compress & cache
    .pipe(cache('images'))

    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true
    }))
    .pipe(gulp.dest(dest + '/images'))

    // Notification
    .pipe(notify({ message: 'Images task complete' }));
});

//------------------------------------------------------------------------------
// Sprites task
//------------------------------------------------------------------------------
gulp.task('sprites', function () {
    return sprity.src({
        cssPath: 'https://s3.amazonaws.com/sneakpeeq-sites/'+siteName+'/images/sprite.png',
        src: src + '/sprites/**/*.png',
        style: '_sprites.scss',
        processor: 'sass',
    })

    // Error Handling
    .pipe(plumber({errorHandler: onError}))

    .pipe(gulpif('*.png', gulp.dest(src + '/images'), gulp.dest(src + '/scss')));
});

//------------------------------------------------------------------------------
// Development task
//------------------------------------------------------------------------------
gulp.task('dev', ['images'], function() {
    gulp.watch(src + '/images/**/*', ['images']);
});

//------------------------------------------------------------------------------
// Default task
//------------------------------------------------------------------------------
gulp.task('default', ['sprites', 'images']);
