### 一个简单的打包器

通过 `@babel/parser` 转化为 ast

通过 `@babel/traverse` 获取 ast 树中的依赖关系

通过 `babel-core` `babel-preset-env` 把 esm 转化为 cjs

通过 `ejs` 模版解析

通过 `tapable` 来模拟事件

loader 用来加载不同类型的文件 loader 是一个纯函数 可以通过设置 this 指向来给 loader 暴露一些 api

plugins 是基于事件的 在不同的事件段处理不同的问题
