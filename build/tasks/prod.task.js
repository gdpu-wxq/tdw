let clean =require('./clean');
let style =require('./style');
let ejs =require('./ejs');
let useref =require('./useref');
let revJs =require('./revJs');
let revHtml =require('./revHtml');
let imagemin =require('./imagemin');
let copyMedia =require('./copyMedia');

module.exports= function prodTask(gulp, plugin, config) {
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
    let revJsTask = () => {
        return revJs(gulp, plugin, config);
    };
    let revHtmlTask = () => {
        return revHtml(gulp, plugin, config);
    };
    let imageminTask = () => {
        return imagemin(gulp, plugin, config);
    };
    let copyMediaTask = () => {
        return copyMedia(gulp, plugin, config);
    };

    return gulp.series(cleanFile, gulp.parallel(styleCompile, ejstask, imageminTask, copyMediaTask), userefTask, revJsTask, revHtmlTask);
}
