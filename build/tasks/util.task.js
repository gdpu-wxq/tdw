/**
 * Create by Wangxiaoqin on 2018/8/29
 */
let fs =require('fs');

module.exports= function utilTask(gulp, plugin, config) {
    let utiltask = () => {
        console.log(config.act);
        let utilJson = JSON.parse(fs.readFileSync(`${config.act}/util.json`));
        console.log(utilJson);
        let utilList = utilJson.map(value => `${config.jsBridgePath}${value}.js`);

        return gulp.src(utilList)
            .pipe(plugin.concat('util.js'))//输入到all.min.js中
            .pipe(gulp.dest(`${config.act}/js/`));
    };
    let watchFile = () => {
        gulp.watch(`${config.act}/util.json`, utiltask);
    }
    return gulp.series(utiltask,gulp.parallel(watchFile));

}
