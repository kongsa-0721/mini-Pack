export default class changeOutPutPath {
  apply(hooks) {
    hooks.emitFile.tap("task1", (context) => {
      console.log("plugin");
      context.changePath("./dist/kong.js");
    });
  }
}
