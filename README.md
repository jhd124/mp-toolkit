<h1 align="center">
  <p align="center">mp-toolkit</p>
</h1>

<p align="center">
  <a href="https://github.com/facebook/docusaurus/actions/workflows/tests.yml"><img src="https://github.com/facebook/docusaurus/actions/workflows/tests.yml/badge.svg" alt="GitHub Actions status"></a>
  <a href="CONTRIBUTING.md#pull-requests"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
  <a href="#license"><img src="https://img.shields.io/github/license/sourcerer-io/hall-of-fame.svg?colorB=ff0000"></a>
  <a href="https://github.com/facebook/jest"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="Tested with Jest"></a>
</p>

## 简介

Mp-toolkit 是一个原生微信小程序工具库，让原生小程序开发更方便。

使用 mp-toolkit，你可以轻松地：

- 注册、监听、派发全局事件
- 管理全局状态
- 注册防抖函数
- 注册节流函数

基本用法

```typescript
// setup-mp-toolkit.ts

import { setup } from "@mp-toolkit";

const eventDefine = {
  onSearch: (keyWord: string) => {},
};

const initialState = {
  todoList: [
    {
      status: "TO_BE_ADD",
      description: "",
    },
  ],
};

const mpToolkit = setup({
  eventDefine,
  initialState,
});

export const chain = mpToolkit.chain;
```

```typescript
// app.ts
import { chain } from "./setup-mp-toolkit";

chain()
  .app({
    // 同原生小程序App方法的参数
    onLaunch() {},
  })
  .create();
```

```typescript
// page.ts
import { chain } from "./setup-mp-toolkit";

chain()
  .page({
    // 同原生小程序Component方法的参数
    methods: {
      onLoad() {},
    },
  })
  .debounce({
    someActionDebounced: {
      method() {},
      time: 1000,
    },
  })
  .throttle({
    someActionThrottled: {
      method() {},
      time: 60,
    },
  })
  .create();
```

## 示例
点击此处查看
[示例小程序](https://developers.weixin.qq.com/s/sB77b7mc7aAz)

## Installation

Use the initialization CLI to create your site:

npm install --save mp-toolkit


## 联系作者

18610935679 微信同号

## License

mp-toolkit 使用 [MIT licensed](./LICENSE).


