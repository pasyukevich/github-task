let gulp = require('gulp'),
  inject = require('gulp-inject'),
  templateCache = require('gulp-angular-templatecache'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  livereload=require('gulp-livereload');
gulp.task('default', ['copyVendor','templateRefactoring','concat','copyIndex','copyVendorFonts','copyStyles']);
gulp.task('copyVendor', (done) => {
  return gulp.src(vendor_files, {
    base: './node_modules'
  }).pipe(gulp.dest('./dist/vendor', {
    overwrite: true
  }));
});
gulp.task('copyVendorFonts',()=>{
  return gulp.src(vendor_fonts,{
    base: './node_modules'
  }).pipe(gulp.dest('./dist/vendor/',{
    overwrite:true
  }));
});
gulp.task('copyStyles',()=>{
  return gulp.src(['css/style.css'],{
    base: './css'
  }).pipe(gulp.dest('./dist/app',{
    overwrite:true
  }));
});
gulp.task('concat', function () {
  return gulp.src('app/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist/app'));
})
gulp.task('clean', () => {
  return gulp.src('dist/**', {
      read: false
    })
    .pipe(clean());
});
gulp.task('templateRefactoring', () => {
  return gulp.src('app/**/*.html')
    .pipe(templateCache('templates.js', {
      module: 'githubSearch'
    }))
    .pipe(gulp.dest('./dist/app'));
});
const vendor_files = ['./node_modules/angular/angular.js',
  './node_modules/**/ui-bootstrap-tpls.js',
  './node_modules/**/visualizer.min.js',
  './node_modules/**/angular-ui-router.js',
  './node_modules/**/angular-aria.js',
  './node_modules/**/angular-animate.min.js',
  './node_modules/**/angular-material.js',
  './node_modules/**/bootstrap.css',
  './node_modules/**/font-awesome.min.css'
];
const app_files = ['./dist/app/bundle.js',
  './dist/app/templates.js',
  './dist/app/style.css'
];

const vendor_fonts=['./node_modules/font-awesome/fonts/**'];
const app_fonts=[];

gulp.task('copyIndex',['concat','templateRefactoring','copyVendorFonts','copyStyles'], (done) => {
  let vendorSources = gulp.src(vendor_files, {
      read: false
    }),
    appSources = gulp.src(app_files, {
      read: false
    })
  return gulp.src('index.html')
    .pipe(inject(vendorSources, {
      name: 'vendor',
      ignorePath: 'node_modules',
      addPrefix: 'dist/vendor'
    }))
    .pipe(inject(appSources, {
      name: 'app'
    }))
    .pipe(gulp.dest('./dist', {
      overwrite: true
    }));
});

gulp.task('watch',()=>{
  gulp.watch(['app/**/*.js','app/**/*.html','css/*.css'],['default']);
})