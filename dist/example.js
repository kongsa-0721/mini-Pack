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
    //返回值是一个exports 假如是foo进来  就是把foo给暴露在全局作用域 main.js里面调用
    return module.exports;
  }
  require(0);
})({
  0: [
    (require, module, exports) => {
      const { foo } = require("./foo.js");
      foo();
      console.log("this is main");
    },
    {
      "./foo.js": 1,
    },
  ],
  1: [
    (require, module, exports) => {
      function foo() {
        console.log("foo");
      }
      module.exports = {
        foo: foo,
      };
    },
    {},
  ],
});
