let clean =require('./clean');
let style =require('./style');
let ejs =require('./ejs');
let browser=require('./browserSync');
let watch=require('./watch');

module.exports= function serve(gulp, plugin, config) {
    let cleanFile = () => {
        return clean(gulp, plugin, config);
    };
    let styleCompile = () => {
        return style(gulp, plugin, config)
    };
    let ejstask = () => {
        return ejs(gulp, plugin, config);
    };
    let browserSync = () => {
        return browser(gulp, plugin, config)
    };
    let watchFile = () => {
        watch(gulp, plugin, config)
    }

    return gulp.series(cleanFile, gulp.parallel(styleCompile, ejstask), gulp.parallel(browserSync, watchFile));
}
