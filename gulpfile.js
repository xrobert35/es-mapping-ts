var gulp = require('gulp');
var clean = require('gulp-clean');

var path = {
  dist: "dist",
  reports: "reports",
  app: {
    src: "src/**/*.ts"
  }
};

/**
 * Clean src and dist directory
 */
gulp.task('clean', function () {
  return gulp.src([
    path.dist,
    "src/**/*.js"
  ]).pipe(clean({ force: true }));
});