var shortcode = require('shortcode-parser'),
    xtend = require('xtend'),
    plugin;


plugin = function(opts) {
    Object.keys(opts.shortcodes).forEach(function (shortc) {
      shortcode.add(shortc, opts.shortcodes[shortc]);
    });

    return function (files, metalsmith, done) {
        Object.keys(files).forEach(function (file) {
            if (!files[file].shortcodes) { return; }
            var cnt = files[file].contents.toString(),
                data = xtend(files[file], metalsmith.metadata());
                console.log(data);

            if (opts.clean) {
                // clean possible <p> tags around
                // the shortcodes that the markdown parser creates
                cnt = cnt.replace(/(<p>)(\[.*?\])(<\/p>)/gi, function (all, p, code) {
                    return code;
                });
            }

            files[file].contents = new Buffer(shortcode.parse(cnt, data));
        });
        done();
    };
};  


module.exports = plugin;

