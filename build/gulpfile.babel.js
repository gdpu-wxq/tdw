let gulp =require('gulp');
let path =require('path');
let getConfig =require('./config');
let febuild=require('../bin/febuild')
let gulpLoadPlugins =require('gulp-load-plugins');
let  serve  =require('./tasks/serve.task');
let buildTask =require('./tasks/build.task');
let prodTask =require('./tasks/prod.task');
let spriteTask =require('./tasks/sprite');
let utilTask =require('./tasks/util.task');

const actPath = `${foo}/src/activities/${ process.env.PJ_PATH }/`;
let npmPath=path.resolve(__dirname, '..');
const jsBridgePath=`${npmPath}/src/jsBridgeApi/`;
let gulpPlugin = gulpLoadPlugins({
        pattern: ['gulp-*', 'gulp.*', 'del', 'browser-sync', 'merge-stream', 'vinyl-buffer', 'imagemin-pngquant'],
        lazy: true
    });

const sprite = () => {
        return spriteTask(gulp, gulpPlugin, getConfig({isDev: false, basePath: actPath }));
    }

const dev = serve(gulp, gulpPlugin, getConfig({isDev: true, basePath: actPath }));

const build = buildTask(gulp, gulpPlugin, getConfig({isDev: false, basePath: actPath }));

const prod = prodTask(gulp, gulpPlugin, getConfig({isDev: false, basePath: actPath }));

const util = utilTask(gulp, gulpPlugin, getConfig({isDev: false, basePath: actPath ,jsBridgePath:jsBridgePath}));

module.exports={ dev, build, prod, sprite, util }
