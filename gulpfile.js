const gulp = require('gulp');
const ts = require('gulp-typescript');

// build typescript
const buildTs = () => {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp
    .src('src/ts/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest(tsProject.config.compilerOptions.outDir));
};

// task to build typescript
gulp.task('default', buildTs);

// watch for change
gulp.task('watch', () => {
  gulp.watch(['src'], buildTs);
});
