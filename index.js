import fs from "fs";
import path from "path";
import ejs from "ejs";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import { transformFromAst } from "babel-core";

let id = 0;
function createAsset(filepath) {
  //获取内容
  const source = fs.readFileSync(filepath, {
    encoding: "utf-8",
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
  const code = ejs.render(template, { data });
  console.log(data);
  fs.writeFileSync("./dist/bundle.js", code);
}

build(graph);
