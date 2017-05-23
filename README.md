# Falcon Front-End Project #

## 开发
```bash
    # 安装依赖
    npm install

    # 本地开发Server
    npm run dev
```
访问地址 http://localhost:8890

## 发布
```bash
    # 发布测试环境
    npm run build:test 

    # 启动打包分析器
    npm run build:ba

    # 构建生产环境
    npm run build
```

## 目录结构
```shell
├── build                      // 构建相关  
├── config                     // 配置相关
├── src                        // 源代码
│   ├── api                    // API请求
│   ├── assets                 // 静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局filter
│   ├── mock                   // mock数据
│   ├── router                 // 路由
│   ├── store                  // 全局store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── view                   // 视图页面
│   ├── App.vue                // 入口页面
│   └── main.js                // 入口 加载组件 初始化等
├── .babelrc                   // babel-loader 配置
├── eslintrc.js                // eslint 配置项
├── .gitignore                 // gitignore
├── favicon.ico                // favicon图标
├── index.html                 // 入口html模板
└── package.json               // package

```
