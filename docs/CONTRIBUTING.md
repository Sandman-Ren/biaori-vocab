# 贡献指南

**Project**: 中日交流标准日本语 - 词汇学习系统  
**Date**: January 15, 2025  

欢迎为本项目贡献代码！本指南将帮助你了解如何参与项目开发。

## 🎯 贡献方式

### 代码贡献
- 修复 Bug
- 添加新功能
- 性能优化
- 代码重构

### 内容贡献
- 改进文档
- 翻译内容
- 词汇数据校正
- 用户体验建议

### 测试贡献
- 编写测试用例
- 报告 Bug
- 性能测试
- 兼容性测试

## 🚀 快速开始

### 1. 准备环境
```bash
# 克隆仓库
git clone https://github.com/your-username/biaori-vocab.git
cd biaori-vocab

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 创建分支
```bash
# 创建功能分支
git checkout -b feature/your-feature-name

# 或创建修复分支
git checkout -b fix/bug-description
```

### 3. 开发与测试
```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

### 4. 提交代码
```bash
# 添加更改
git add .

# 提交 (使用约定式提交)
git commit -m "feat: add vocabulary search functionality"

# 推送分支
git push origin feature/your-feature-name
```

## 📝 代码规范

### 提交信息格式
使用 [约定式提交](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 格式：

```
<类型>[可选 范围]: <描述>

[可选 正文]

[可选 脚注]
```

**类型**:
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建或工具更改

**示例**:
```bash
feat(modal): add vocabulary detail modal animation
fix(filter): resolve search input clearing issue
docs(api): update component API documentation
```

### 代码风格
- 使用 TypeScript
- 遵循 ESLint 配置
- 使用 Prettier 格式化
- 组件使用 PascalCase
- 函数使用 camelCase
- 常量使用 SCREAMING_SNAKE_CASE

### 文件结构
```
components/
  ├── ui/           # 基础UI组件
  ├── features/     # 功能组件
  └── layout/       # 布局组件

lib/
  ├── utils/        # 工具函数
  ├── hooks/        # 自定义钩子
  └── types/        # 类型定义

docs/
  ├── api/          # API文档
  ├── design/       # 设计文档
  └── data/         # 数据文档
```

## 🧪 测试要求

### 单元测试
- 新功能必须包含测试
- 测试覆盖率 > 80%
- 使用 Jest + React Testing Library

```typescript
// 示例测试
import { render, screen } from '@testing-library/react';
import { VocabularyTable } from './vocabulary-table';

describe('VocabularyTable', () => {
  it('renders vocabulary data correctly', () => {
    const mockData = [/* 测试数据 */];
    render(<VocabularyTable data={mockData} />);
    
    expect(screen.getByText('词汇表')).toBeInTheDocument();
  });
});
```

### 集成测试
- 关键用户流程测试
- API 集成测试
- 跨浏览器兼容性

### 性能测试
- 组件渲染性能
- 大数据集处理
- 内存使用监控

## 🎨 设计原则

### UI/UX 原则
1. **用户体验优先**: 所有设计决策以用户为中心
2. **响应式设计**: 支持所有设备和屏幕尺寸
3. **无障碍访问**: 遵循 WCAG 2.1 AA 标准
4. **一致性**: 保持视觉和交互的一致性

### 代码原则
1. **可读性**: 代码应该自解释
2. **可维护性**: 模块化和低耦合
3. **性能**: 优化关键路径
4. **扩展性**: 考虑未来需求

## 📋 Pull Request 流程

### 提交前检查
- [ ] 代码符合规范
- [ ] 测试全部通过
- [ ] 文档已更新
- [ ] 性能影响已评估
- [ ] 兼容性已测试

### PR 模板
```markdown
## 变更类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 破坏性变更
- [ ] 文档更新

## 描述
简要描述你的更改...

## 测试
描述你如何测试这些更改...

## 截图 (如适用)
添加截图帮助解释你的更改...

## 检查清单
- [ ] 我的代码遵循项目的代码规范
- [ ] 我已经进行了自我代码审查
- [ ] 我已经添加了必要的注释
- [ ] 我的更改不会产生新的警告
- [ ] 我已经添加了相应的测试
- [ ] 新旧测试都能通过
```

### 审查流程
1. 自动化检查 (CI/CD)
2. 代码审查 (至少1人)
3. 测试验证
4. 最终批准
5. 合并到主分支

## 🐛 Bug 报告

### Bug 报告模板
```markdown
## Bug 描述
清楚简洁地描述 bug...

## 重现步骤
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 期望行为
描述你期望发生什么...

## 实际行为
描述实际发生了什么...

## 截图
如果适用，添加截图帮助解释问题...

## 环境信息
- 操作系统: [e.g. macOS 12.0]
- 浏览器: [e.g. Chrome 96]
- 设备: [e.g. iPhone 13]

## 额外信息
添加任何其他有关问题的信息...
```

### 优先级标记
- `P0-Critical`: 系统崩溃或数据丢失
- `P1-High`: 核心功能无法使用
- `P2-Medium`: 功能受影响但有解决方案
- `P3-Low`: 小问题或改进建议

## 💡 功能请求

### 功能请求模板
```markdown
## 功能描述
清楚简洁地描述你想要的功能...

## 问题解决
这个功能解决了什么问题？

## 提议的解决方案
描述你希望的实现方式...

## 替代方案
描述你考虑过的其他解决方案...

## 用户价值
这个功能对用户有什么价值？

## 实现难度
- [ ] 容易
- [ ] 中等
- [ ] 困难
- [ ] 需要研究
```

## 📚 开发资源

### 学习资源
- [React 官方文档](https://react.dev/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 开发工具
- [VS Code](https://code.visualstudio.com/) - 推荐编辑器
- [React DevTools](https://github.com/facebook/react/tree/main/packages/react-devtools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

### 设计工具
- [Figma](https://www.figma.com/) - 设计和原型
- [Lucide](https://lucide.dev/) - 图标库
- [Tailwind UI](https://tailwindui.com/) - 组件参考

## 🤝 社区

### 交流渠道
- GitHub Issues: 技术讨论和问题报告
- GitHub Discussions: 一般讨论和想法分享
- Pull Requests: 代码审查和协作

### 行为准则
我们承诺为每个人提供友好、安全和受欢迎的环境，无论：
- 性别、性别认同和表达
- 性取向
- 残疾
- 外貌
- 种族
- 宗教

#### 期望行为
- 使用包容性语言
- 尊重不同观点
- 优雅地接受建设性批评
- 关注社区最佳利益
- 对其他社区成员表示同理心

#### 不可接受行为
- 使用性化语言或图像
- 恶意攻击、侮辱或贬损评论
- 公开或私人骚扰
- 未经明确许可发布他人私人信息
- 在专业环境中不当的行为

## 📄 许可证

通过贡献代码，你同意你的贡献将在与项目相同的许可证下发布。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！你们的努力让这个学习工具变得更好。

### 贡献者
<!-- 这里将自动显示贡献者列表 -->

---

有问题？请随时在 GitHub Issues 中提问，或者查看现有的讨论。我们很乐意帮助新的贡献者开始！
