# dynamic-module-plugin
一个可以定义动态模块的webpack插件；如果你给出ID已有存在的模块与之对应将会被替换  
语言: [English](./README.md) | [简体中文](./README_ZH.md)

## API
**defineDynamicModule(id: string, content: string, context?: string)**  
定义一个动态模块

**purgeDynamicModule(id: string, content: string, context?: string)**  
删除一个你定义的动态模块

## 使用方法
首先，安装插件
```bash
npm install -D @svmio/dynamic-module-plugin
```

在webpack配置中添加插件

**webpack.config.js**

```js
const {DynamicModulePlugin,defineDynamicModule} = require("@svmio/dynamic-module-plugin");

defineDynamicModule(
    './a-dynamic-module.js',
  `import React from 'react';
export default function Test(){
    return (<div>This is a dynamic module</div>)
}`, __dirname);

module.exports = {
  plugins: [
    new DynamicModulePlugin(),
  ],
};
```

在需要的地方直接import即可

**app.js**

```js
import React from 'react';
import Test from './a-dynamic-module.js';

export default function App(){
    return (<Test/>)
}

```
