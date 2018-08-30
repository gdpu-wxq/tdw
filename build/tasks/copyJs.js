'use strict';
// 拷贝逻辑js到dist下
module.exports= function copyJs(gulp, plugin, config) {
    return gulp.src(`${config.act}/js/**/*.js`)
        .pipe(gulp.dest(`${config.path}/js`))
}
