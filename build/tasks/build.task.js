let clean =require('./clean');
let style =require('./style');
let ejs =require('./ejs');
let useref =require('./useref');
let copyJs =require('./copyJs');
let copyMedia =require('./copyMedia');
let imagemin =require('./imagemin');

module.exports= function buildTask(gulp, plugin, config) {
    let cleanFile = () => {
        return clean(gulp, plugin, config);
    };
    let styleCompile = () => {
        return style(gulp, plugin, config);
    };
    let ejstask = () => {
        return ejs(gulp, plugin, config);
    };
    let userefTask = () => {
        return useref(gulp, plugin, config);
    };
    let copyJsTask = () => {
        return copyJs(gulp, plugin, config);
    };
    let imageminTask = () => {
        return imagemin(gulp, plugin, config);
    };
    let copyMediaTask = () => {
        return copyMedia(gulp, plugin, config);
    };

    return gulp.series(cleanFile, gulp.parallel(styleCompile, ejstask), gulp.parallel(userefTask, copyJsTask, imageminTask, copyMediaTask));
}
