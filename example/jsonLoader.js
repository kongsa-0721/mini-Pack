export default function jsonLoader(source) {
  //this被改变了指向 暴露了api出来
  this.addDeps("my deps");
  //这里返回的会被直接当成source源代码 所以要来一个默认导出
  return `export default ${JSON.stringify(source)}`;
}
