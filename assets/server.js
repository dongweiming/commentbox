var colors = require('colors');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var bodyParser = require('body-parser');
var httpProxyMiddleware = require("http-proxy-middleware");
var config = require('./webpack.config.js');

config.debug = true;
config.devtool = 'eval';
Object.keys(config.entry).forEach(key => {
    var item = config.entry[key];
    item.unshift(
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?path=/__webpack_hmr',
        'webpack/hot/only-dev-server'
    );
});

config.plugins = config.plugins.concat(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
);

var compiler = webpack(config);
var app = new WebpackDevServer(compiler, {
    hot: true,
    filename: config.output.filename,
    publicPath: config.output.publicPath,
    stats: {
        assets: false,
        colors: true,
        chunks: false,
        children: false
    }
}).app;

app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
}));

app.use(httpProxyMiddleware('/', {
    target: 'http://localhost:8000/'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, '0.0.0.0', function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('[webpack-dev-server]'.magenta);
    console.log('* You can visit:'.green);
    console.log('   > ' + 'http://0.0.0.0:3000/'.underline.cyan);
});
