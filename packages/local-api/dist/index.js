"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serve = void 0;
var express_1 = __importDefault(require("express"));
var http_proxy_middleware_1 = require("http-proxy-middleware");
var path_1 = __importDefault(require("path"));
var cells_1 = require("./routes/cells");
var serve = function (port, filename, dir, useProxy) {
    var app = express_1.default();
    app.use(cells_1.createCellsRouter(filename, dir));
    if (useProxy) {
        //! This below method will be used when we want active development like... like when we are testing the app and seeing updates the updates on a fly.
        app.use(http_proxy_middleware_1.createProxyMiddleware({
            target: 'http://localhost:3000',
            ws: true,
            logLevel: 'silent',
        }));
    }
    else {
        //! And this method will be used to run the app when it is installed from the npm packages or in production mode
        var packagePath = require.resolve('@js-book-bhargav/local-client/build/index.html'); // require .resolve willl give us the actual path on our machine...
        app.use(express_1.default.static(path_1.default.dirname(packagePath))); // this is done to send the build foldr from local-client to local api but it won't work when we add in npm packages...
    }
    return new Promise(function (resolve, reject) {
        app.listen(port, resolve).on('error', reject);
    });
};
exports.serve = serve;
