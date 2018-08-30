'use strict';


module.exports= function browserSync(gulp, plugin, config) {
    return plugin.browserSync({
        open: 'external',
        server: {
            // baseDir: [config.act, '../src/lib']
            baseDir: config.act,
            routes: {
                '/lib': '../src/lib'
            }
        }
    });
}

