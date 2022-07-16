(function (modules) {
  function require(id) {
    const [fn, mappping] = modules[id];
    const module = {
      exports: {},
    };
    function localRequire(filepath) {
      const id = mappping[filepath];
      return require(id);
    }
    fn(localRequire, module, module.exports);
    return module.exports;
  }
  require(0);
})({
  0: [
    function (require, module, exports) {
      "use strict";

      var _foo = require("./foo.js");

      var _foo2 = _interopRequireDefault(_foo);

      var _info = require("./info.json");

      var _info2 = _interopRequireDefault(_info);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      (0, _foo2.default)();
      console.log(_info2.default);
      console.log("this is main js");
    },
    { "./foo.js": 1, "./info.json": 2 },
  ],

  1: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.default = foo;

      function foo() {
        console.log("this is foo js");
      }
    },
    {},
  ],

  2: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.default = '{\n  "name": "kongsa",\n  "type": "module"\n}\n';
    },
    {},
  ],
});
