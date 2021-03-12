# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).

## Menu 目录说明
- echart图表 :引入echart组件，图表展示。antpro本体用的G2chart
- 上传:使用了jszip，可在上传zip后解析文件目录;jq版本见 utils/read文件夹
## Link
[一文看懂 react hooks](https://blog.csdn.net/landl_ww/article/details/102158814)
[获取zip包目录结构-jq版本](http://gildas-lormeau.github.io/zip.js/demos/demo2.html)
[获取zip包目录结构-npm-jszip](https://stuk.github.io/jszip/documentation/examples/read-local-file-api.html)

[pptx转json:pptx-parser](https://www.npmjs.com/package/pptx-parser)
[拼音的排序,检索,注音](https://github.com/hotoo/pinyin)
## Notice
remove this for commit
```package.json
//  "husky": {
//    "hooks": {
//      "pre-commit": "npm run lint-staged"
//    }
//  },
```
