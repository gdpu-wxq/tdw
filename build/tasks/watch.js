/**
 * Create by Wangxiaoqin on 2018/8/30
 */
let style=require('./style');
let ejs =require('./ejs');

module.exports= function watch(gulp, plugin, config) {
    // gulp.watch(config.path + '/sass/**/*.scss'), style)
    // return gulp.watch([config.path + '*.html', config.path + 'html/**/*.html']).on('change', plugin.browserSync.reload)
    let styleCompile = () => {
        return style(gulp, plugin, config);
    }
    let ejsCompile = () => {
        return ejs(gulp, plugin, config);
    }
    gulp.watch(`${config.act}/sass/*.scss`, styleCompile);
    gulp.watch(`${config.act}/templates/**/*.ejs`, ejsCompile);
    gulp.watch(['*.html', 'html/**/*.html', 'css/**/*.css', 'js/**/*.js'], { cwd: config.act }).on('change', plugin.browserSync.reload)
}