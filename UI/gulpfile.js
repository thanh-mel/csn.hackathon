var gulp = require('gulp');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var sass = require('gulp-sass');
var rucksack = require('gulp-rucksack');
var livereload = require('gulp-livereload');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var base64 = require('gulp-base64');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var filesize = require('gulp-size');
var changed = require('gulp-changed');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync');
var streamify = require('gulp-streamify');

/* bundleLogger.js */
var prettyHrtime = require('pretty-hrtime');
var startTime;
bundleLogger = {
    start: function() {
        startTime = process.hrtime();
        gutil.log('Running', gutil.colors.green("'bundle'") + '...');
    },

    end: function() {
        var taskTime = process.hrtime(startTime);
        var prettyTime = prettyHrtime(taskTime);
        gutil.log('Finished', gutil.colors.green("'bundle'"), 'in', gutil.colors.magenta(prettyTime));
    }
};

/* handleErrors.js */
var notify = require("gulp-notify");
handleErrors = function() {
    var args = Array.prototype.slice.call(arguments);
    // Send error to notification center with gulp-notify
    notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
    }).apply(this, args);

    // Keep gulp from hanging on this task
    this.emit('end');
};
module.exports = bundleLogger;
module.exports = handleErrors;

// Bundle app JS files
gulp.task('bundle-app-js', function() {
    var bundler = browserify({
        // Required watchify args
        cache: {},
        packageCache: {},
        fullPaths: true,

        // Specify the entry point of your app
        entries: ['Frontend/src/js/hackathon.js'],

        // Add file extentions to make optional in your requires
        extensions: ['.js'],

        // Enable source maps!
        debug: true
    });

    var bundle = function() {
        // Log when bundling starts
        bundleLogger.start();

        return bundler
            .bundle()
            // Report compile errors
            .on('error', handleErrors)

        // Use vinyl-source-stream to make the stream gulp compatible. Specifiy the desired output filename here.
        .pipe(source('hackathon.js'))

        .pipe(streamify(uglify()))

        // Specify the output destination
        .pipe(gulp.dest('Assets/js/'))

        .pipe(filesize({ title: 'hackathon.js'} ))

        // Log when bundling completes!
        .on('end', bundleLogger.end);
    };

    if (global.isWatching) {
        bundler = watchify(bundler);

        // Rebundle with watchify on changes.
        bundler.on('update', bundle);
    }

    return bundle();
});

/*  COMPILE SASS  */
gulp.task('compile-sass', function() {
    gulp.src('Frontend/src/scss/hackathon.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        })
        .on('error', sass.logError))
        .pipe(rucksack({
            autoprefixer: true,
            fallbacks: true
        }))
        .pipe(cleanCSS({
            processImport: false,
            keepSpecialComments: 0
        }))
        .pipe(rename('styles.css'))
        // .pipe(base64({
        //     maxImageSize: 8 * 1024,
        //     debug: true
        // }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('Assets/css'))
        .pipe(filesize({ title: 'styles.css'} ))
        .pipe(livereload());
});

/*  COMPILE VENDOR CSS  */
var vendorCSSFiles = [
    'Frontend/vendors/css/owl.carousel.css',
    'Frontend/vendors/css/owl.theme.default.css',
    'Frontend/vendors/css/animate.css',
    'Frontend/vendors/css/nouislider.css',
    'Frontend/vendors/css/nouislider.pips.css',
    'Frontend/vendors/css/nouislider.tooltips.css',
    'Frontend/vendors/css/tipso.css'
];
gulp.task('compile-vendor-css', function() {
    return gulp.src(vendorCSSFiles)
        .pipe(changed('build/css'))
        .pipe(cleanCSS({
            processImport: false,
            keepSpecialComments: 0
        }))
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest('Assets/css'))
        .pipe(filesize({ title: 'vendors.css'} ))
        .on('error', gutil.log);
});

/*  CONCAT & MINIFY JS FILES  */
var vendorJSFiles = [
    'Frontend/vendors/js/lodash.js',
    'Frontend/vendors/js/jquery.js',
    'Frontend/vendors/js/jquery-migrate-1.3.0.js',
    'Frontend/vendors/js/modernizr.js',
    'Frontend/vendors/js/nouislider.js',
    'Frontend/vendors/js/wNumb.js',
    'Frontend/vendors/js/tipso.js',
    'Frontend/vendors/js/promise.js',
    'Frontend/vendors/js/jquery.easytabs.js',
    'Frontend/vendors/js/jquery.hashchange.min.js'
];
var localJSFiles = [
    'Frontend/src/js/hackathon.js'
];

gulp.task('compile-vendor-js', function() {
    gulp.src(vendorJSFiles)
        .pipe(changed('Assets/js'))
        .pipe(concat('vendors.js'))
        .pipe(uglify())
        .pipe(filesize({ title: 'vendors.js'} ))
        .pipe(gulp.dest('Assets/js'))
        .on('error', gutil.log);
});

/*  OPTIMIZE IMAGES  */
gulp.task('optimize-images', function() {
    return gulp.src('Frontend/images/**/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progessive: true,
            interlaced: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('Assets/images'));
});

gulp.task('copy-fonts', function() {
    return gulp.src('./Frontend/fonts/**/*.{ttf,woff,woff2,eof,eot,svg}')
        .pipe(gulp.dest('Assets/fonts'))
});

gulp.task('copy-static-files', function() {
    return gulp.src('./Frontend/others/**/*')
        .pipe(gulp.dest('Assets/static'))
});

/*  WATCH FILES  */
gulp.task('watch', ['setWatch', 'browserSync'], function() {
    gulp.watch('Frontend/src/js/**/*', ['bundle-app-js']);
    gulp.watch('Frontend/src/scss/**/*', ['compile-sass']);

    gulp.watch('Frontend/vendors/js/**/*', ['compile-vendor-js']);
    gulp.watch('Frontend/vendors/css/**/*', ['compile-vendor-css']);

    gulp.watch('Frontend/images/**/*', ['optimize-images']);
    gulp.watch('Frontend/fonts/**/*', ['copy-fonts']);
    gulp.watch('Frontend/others/**/*', ['copy-static-files']);
});

gulp.task('setWatch', function() {
    global.isWatching = true;
});

gulp.task('browserSync', ['build'], function() {
    browserSync.init(
        [
            './Frontend/static/**/*.html',
            './Assets/css/**/*.css',
            './Assets/js/**/*.js',
            './Assets/images/*.{jpg,jpeg,gif,png,svg}'
        ],
        {
            server: {
                baseDir: './',
                index: './Frontend/static/index.html',
                serveStaticOptions: {
                    extensions: ['html']
                },
                routes: {
                    "/slider":     './Frontend/static/slider.html'
                }
            }
        }
    );
});

gulp.task('default', ['watch']);
gulp.task('build', [
    'bundle-app-js',
    'compile-sass',
    'compile-vendor-js',
    'compile-vendor-css',
    'optimize-images',
    'copy-fonts',
    'copy-static-files'
]);
