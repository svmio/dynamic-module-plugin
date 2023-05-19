# dynamic-module-plugin
A webpack plugin used to define a dynamic module. It will replace the module if the given id hits a existing one.  
Languages: [English]() | [简体中文](./README_ZH.md)

## API
**defineDynamic(id: string, content: string, context?: string)**  
Define a dynamic module  

**purgeDynamic(id: string, content: string, context?: string)**  
Purge a dynamic module you defined

## Getting Started
To begin, you'll need to install dynamic-module-plugin:
```bash
npm install -D @svmio/dynamic-module-plugin
```
Then add the plugin to your webpack config. For example:

**webpack.config.js**

```js
const {DynamicModulePlugin,defineDynamic} = require("@svmio/dynamic-module-plugin");

defineDynamic(
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

Now, you can use the dynamic module you defined：

**app.js**

```js
import React from 'react';
import Test from './a-dynamic-module.js';

export default function App(){
    return (<Test/>)
}

```
