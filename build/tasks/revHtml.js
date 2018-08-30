'use strict';
//Html替换css、js文件版本
module.exports= function revHtml(gulp, plugin, config) {
    return gulp.src([`${config.path}/js/**/*.json`, `${config.path}/html/**/*.html`])
    .pipe(plugin.revCollector())
    .pipe(gulp.dest(`${config.path}/html`))
}
