const gulp = require('gulp');
const dartSass = require('sass');
const sass = require('gulp-sass')(dartSass);
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

// build scss
const buildScss = () => {
  return gulp
    .src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/css'));
};

// build typescript
const buildTs = () => {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp
    .src('src/ts/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest(tsProject.config.compilerOptions.outDir));
};

// task to build scss
gulp.task('build-scss', buildScss);

// task to build typescript
gulp.task('build-ts', buildTs);

// default task
gulp.task('default', gulp.parallel(buildScss, buildTs));

// watch for change
gulp.task('watch', () => {
  gulp.watch(['src'], gulp.parallel(buildScss, buildTs));
});
