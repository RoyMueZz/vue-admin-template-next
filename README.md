# vue-admin-template-next

## Commit message规范在rrd-fe落地使用情况
[参考资料](https://zhuanlan.zhihu.com/p/88870009)
1. type
type为必填项，用于指定commit的类型，约定了feat、fix两个主要type，以及docs、style、build、refactor、revert五个特殊type，其余type暂不使用。

```
  # 主要type
  feat:     增加新功能
  fix:      修复bug

  # 特殊type
  docs:     只改动了文档相关的内容
  style:    不影响代码含义的改动，例如去掉空格、改变缩进、增  删分号
  build:    构造工具的或者外部依赖的改动，例如webpack，npm
  refactor: 代码重构时使用
  revert:   执行git revert打印的message

  # 暂不使用type
  test:     添加测试或者修改现有测试
  perf:     提高性能的改动
  ci:       与CI（持续集成服务）有关的改动
  chore:    不修改src或者test的其余修改，例如构建过程或辅助 工具的变动
```
> 当一次改动包括主要type与特殊type时，统一采用主要type。