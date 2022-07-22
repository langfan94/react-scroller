'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'));
var _JSON$stringify = _interopDefault(require('babel-runtime/core-js/json/stringify'));
var _asyncToGenerator = _interopDefault(require('babel-runtime/helpers/asyncToGenerator'));
var _Promise = _interopDefault(require('babel-runtime/core-js/promise'));
var fs = _interopDefault(require('fs-extra'));
var path = require('path');
var less = _interopDefault(require('less'));
var rollupPluginutils = require('rollup-pluginutils');
var mkdirp = _interopDefault(require('mkdirp'));

/*
 * create a style tag and append to head tag
 * @params {String} css style
 */

function insertStyle(css) {
    if (!css) return;

    if (typeof window == 'undefined') return;
    var style = document.createElement('style');
    style.setAttribute('media', 'screen');

    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
}

/**
 * Appends to a file even if its directory does not exist
 * @param {String} path the path of the file write to
 * @param {String} contents contents of file
 */
var appendToFile = function appendToFile(path$$, contents) {
    return new _Promise(function (resolve, reject) {
        mkdirp(path.dirname(path$$), function (err) {
            if (err) {
                reject(err);
            }

            fs.appendFileSync(path$$, contents);
            resolve();
        });
    });
};

var renderSync = function renderSync(code, option) {
    return less.render(code, option).then(function (output) {
        return output.css;
    }, function (error) {
        throw error;
    });
};

var fileCount = 0;

function plugin() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    options.insert = options.insert || false;
    var filter = rollupPluginutils.createFilter(options.include || ['**/*.less', '**/*.css'], options.exclude || 'node_modules/**');
    options.watch = options.watch || false;
    var injectFnName = '__$styleInject';
    return {
        name: 'less',
        intro: function intro() {
            return options.insert ? insertStyle.toString().replace(/insertStyle/, injectFnName) : '';
        },
        load: function load() {
            if (options.watch) {
                fileCount = 0;
            }
        },
        transform: function transform(code, id) {
            var _this = this;

            return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
                var css, exportCode;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (filter(id)) {
                                    _context.next = 2;
                                    break;
                                }

                                return _context.abrupt('return', null);

                            case 2:
                                fileCount++;

                                _context.prev = 3;

                                options.option = options.option || {};
                                options.option['filename'] = id;
                                options.output = options.output === undefined || options.output === true ? 'rollup.build.css' : options.output;
                                if (options.plugins) {
                                    options.option['plugins'] = options.plugins;
                                }

                                _context.next = 10;
                                return renderSync(code, options.option);

                            case 10:
                                css = _context.sent;

                                if (!(options.output && isFunc(options.output))) {
                                    _context.next = 15;
                                    break;
                                }

                                _context.next = 14;
                                return options.output(css, id);

                            case 14:
                                css = _context.sent;

                            case 15:
                                if (!(options.output && isString(options.output))) {
                                    _context.next = 19;
                                    break;
                                }

                                if (fileCount == 1) {
                                    //clean the output file
                                    fs.removeSync(options.output);
                                }
                                _context.next = 19;
                                return appendToFile(options.output, css);

                            case 19:
                                exportCode = '';


                                if (options.insert != false) {
                                    exportCode = 'export default ' + injectFnName + '(' + _JSON$stringify(css.toString()) + ');';
                                } else {
                                    exportCode = 'export default ' + _JSON$stringify(css.toString()) + ';';
                                }
                                return _context.abrupt('return', {
                                    code: exportCode,
                                    map: {
                                        mappings: ''
                                    }
                                });

                            case 24:
                                _context.prev = 24;
                                _context.t0 = _context['catch'](3);
                                throw _context.t0;

                            case 27:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this, [[3, 24]]);
            }))();
        }
    };
};

function isString(str) {
    if (typeof str == 'string') {
        return true;
    } else {
        return false;
    }
}

function isFunc(fn) {
    if (typeof fn == 'function') {
        return true;
    } else {
        return false;
    }
}

module.exports = plugin;