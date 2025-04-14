module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能（feature）
        'bug', // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
        'fix', // 修补bug
        'ui', // 更新 ui
        'docs', // 文档（documentation）
        'style', // 格式（不影响代码运行的变动）
        'perf', // 性能优化
        'release', // 发布
        'deploy', // 部署
        'refactor', // 重构（即不是新增功能，也不是修改bug的代码变动）
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
        'merge', // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
        'other', // 其它更改
        'build', // 打包
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],  
    'type-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'header-max-length': [0, 'always', 72],
  },
};
