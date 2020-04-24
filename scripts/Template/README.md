# 注意事项

- 安装依赖使用命令 `npm i @tbminiapp/egret-appx-component @tbminiapp/egret-res --by=yarn --save `
- 若有资源文件，放置在`resource`目录，并添加 `mini.project.json` 配置文件
```
{
  "include": [
    "**/*.json",
    "**/*.exml",
    "**/*.js"
  ]
}
```