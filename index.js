import fs from "fs";
import path from "path";
import ejs from "ejs";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAst } from "babel-core";
import jsonLoader from "./example/jsonLoader.js";

//id就是每一个文件的id
let id = 0;
const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: jsonLoader,
      },
    ],
  },
};
function createAsset(filepath) {
  //获取内容
  let source = fs.readFileSync(filepath, {
    encoding: "utf-8",
  });
  //loader
  const loaders = webpackConfig.module.rules;
  //添加依赖
  const loaderContext = {
    addDeps(deps) {
      console.log("this is a", deps);
    },
  };
  loaders.forEach(({ test, use }) => {
    if (test.test(filepath)) {
      //使用call改变this指向
      source = use.call(loaderContext, source);
    }
  });
  //获取依赖关系 通过ast
  const ast = parser.parse(source, {
    sourceType: "module",
  });
  const deps = [];
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      //把依赖关系push进去
      deps.push(node.source.value);
    },
  });
  //把esm转化为cjs 需要安装babel-preset-env依赖
  const { code } = transformFromAst(ast, null, {
    presets: ["env"],
  });
  //导出 源代码 依赖关系 文件名 cjs
  return {
    source: source,
    deps: deps,
    filepath: filepath,
    code: code,
    id: id++,
    mapping: {},
  };
}

//获取依赖关系图

function createGraph() {
  const mainAsset = createAsset("./example/main.js");

  const queue = [mainAsset];

  for (const asset of queue) {
    asset.deps.forEach((relativePath) => {
      const child = createAsset(path.resolve("./example", relativePath));
      //把映射关系写进去
      asset.mapping[relativePath] = child.id;
      queue.push(child);
    });
  }
  return queue;
}
const graph = createGraph();
//处理这个图结构 动态渲染
function build(graph) {
  const template = fs.readFileSync("./dist/bundle.ejs", { encoding: "utf-8" });
  const data = graph.map((asset) => {
    const { id, code, mapping } = asset;
    return {
      id,
      code,
      mapping,
    };
  });
  //把esm转化为cjs ejs.render
  const code = ejs.render(template, { data });
  console.log(data);
  fs.writeFileSync("./dist/bundle.js", code);
}

build(graph);
