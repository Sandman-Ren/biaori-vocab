# 中日交流标准日本语 - 词汇学习系统文档

欢迎来到词汇学习系统的完整文档。这里包含了系统设计、API文档、数据处理流程以及开发指南的全面信息。

## 📋 文档目录

### 🏗️ 系统设计
- [**系统设计文档**](design/system-design.md) - 完整的系统架构、设计理念和技术选型
- [**UI/UX设计规范**](design/ui-design.md) - 界面设计原则、组件规范和交互模式
- [**动画系统设计**](design/animation-system.md) - 动画架构、配置和最佳实践
- [**响应式设计**](design/responsive-design.md) - 移动端适配和响应式布局策略

### 🔧 API文档
- [**模态框API**](api/modal-api.md) - VocabularyDetailModal组件完整API文档
- [**组件API**](api/components-api.md) - 所有主要组件的接口和使用方法
- [**工具函数API**](api/utilities-api.md) - 公共工具函数和库的使用指南

### 📊 数据系统
- [**数据结构规范**](data/data-structure.md) - 词汇数据的完整结构定义
- [**数据生命周期**](data/data-lifecycle.md) - 从抓取到部署的完整数据流程
- [**后处理指南**](data/post-processing-guide.md) - Python爬虫的数据处理实现
- [**数据重现步骤**](data/reproduction-steps.md) - 重现vocabulary.json的完整步骤

### 📚 开发指南
- [**开发日志**](DEVELOPMENT_LOG.md) - 详细的开发过程和问题解决记录
- [**贡献指南**](CONTRIBUTING.md) - 如何参与项目开发
- [**部署指南**](DEPLOYMENT.md) - 项目部署和配置说明

## 🚀 快速开始

### 新开发者入门
1. 阅读 [系统设计文档](design/system-design.md) 了解项目架构
2. 查看 [开发日志](DEVELOPMENT_LOG.md) 了解项目演进历程
3. 参考 [组件API文档](api/components-api.md) 开始编码

### 数据团队
1. 了解 [数据结构规范](data/data-structure.md)
2. 实施 [后处理指南](data/post-processing-guide.md)
3. 使用 [数据重现步骤](data/reproduction-steps.md) 验证数据完整性

### 设计团队
1. 参考 [UI/UX设计规范](design/ui-design.md)
2. 了解 [动画系统设计](design/animation-system.md)
3. 查看 [响应式设计](design/responsive-design.md) 指南

## 📖 项目概览

### 技术栈
- **前端框架**: Next.js 15 with App Router
- **UI组件**: shadcn/ui + Tailwind CSS
- **动画库**: Framer Motion
- **类型系统**: TypeScript
- **构建工具**: Next.js static export

### 核心特性
- **完全中文界面**: 针对中文学习者优化
- **响应式设计**: 移动端和桌面端完美适配
- **流畅动画**: 基于弹簧物理的专业动画
- **详细模态框**: 词汇详情展示和交互
- **高级筛选**: 多维度数据探索
- **动词变位**: 15种变位形式支持

### 项目统计
- **代码行数**: ~3000+ 行
- **组件数量**: 15+ 个主要组件
- **文档文件**: 10+ 个文档文件
- **词汇数据**: 2800+ 个词汇项
- **支持格式**: 4种导出格式

## 🔄 文档更新

本文档与代码同步更新。每次重要功能更新都会相应更新文档。

### 最后更新
- **日期**: 2025年7月15日
- **版本**: v1.1.0
- **更新内容**: 完整的文档结构重组和模态框功能文档

## 🤝 贡献

欢迎为文档贡献内容！请参考 [贡献指南](CONTRIBUTING.md) 了解详细流程。

## 📞 联系方式

如有任何疑问，请通过GitHub Issues提出。
