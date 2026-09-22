# 飞书多维表格 Landing Page

从保存的页面快照重建的纯静态版本，无构建步骤、无框架依赖。

## 本地开发

必须通过 HTTP 打开（`main.js` 是 ES module，`file://` 下会被 CORS 拦住）：

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

改完直接刷新，没有编译环节。

## 目录

```text
.
├── index.html        页面结构（六个 section）
├── styles.css        全部样式，顶部是 --asset-* 背景图变量
├── main.js           hero 轮播 / 对比表 / 滚动淡入
├── ascii-trail.js    ASCII 流体背景（独立模块）
├── assets/           图片资源
└── fonts/            FZ 字体三个字重
```

## 常见改动位置

| 想改什么 | 改哪里 |
|---|---|
| 文案、增删 section | `index.html` |
| hero 轮播的四个场景 | `main.js` 的 `SCENES` |
| 轮播节奏（打字速度、停留时长） | `main.js` 顶部的时间常量 |
| 对比表内容 | `main.js` 的 `COMPARISON_ROWS` / `COMPARISON_COLUMNS` |
| 窄屏折叠时显示哪几行 | `main.js` 的 `COMPACT_ROWS` |
| ASCII 字符集、字号、帧率 | `ascii-trail.js` 的 `ASCII_DEFAULTS` |
| ASCII 流体手感（拖尾、喷溅） | `ascii-trail.js` 的 `FLUID_DEFAULTS` |
| 背景图 | 换掉 `assets/` 里的文件，或改 `styles.css` 顶部变量 |

## 两块动态内容

以下内容由 JS 在运行时生成，在 `index.html` 里看不到：

- **打字机字符**：`.demand-typing` 内的 `<span>` 由 `renderTyping()` 逐字生成
- **对比表**：`.comparison` 是空容器，904px 以上渲染表格，以下渲染卡片 + 展开按钮

## ASCII 背景说明

`[data-hover-effect="ascii-trail"]` 容器内的 `img[data-ascii-source]` 会被实时
降采样成字符画，叠加一层 2D 不可压缩流体模拟：指针移动注入速度与密度，点击产生
环形喷溅，流体密度再反过来调制字符亮度。

**静止时画布是空的**，字符只在指针经过处浮现——这是设计如此，不是渲染失败。

自动降级：`prefers-reduced-motion` 下关闭流体，元素离开视口暂停，标签页隐藏时停止，
图片跨域污染画布时停止渲染并标记 `data-ascii-overlay-state="tainted"`。

## 与原快照的差异

- 原页面是 React 运行时渲染，这里是静态 DOM + 原生 JS，组件边界不再存在
- 原先内联为 base64 的资源已拆成独立文件，页面体积从 18MB 降到约 30KB（不含资源）
- 原快照中的浏览器扩展注入内容（Grammarly 等）已移除

## 语言与 URL

页面支持中文、日文、英文，默认中文：

- `?lang=zh`：中文
- `?lang=ja`：日本語
- `?lang=en`：English

也接受 `zh-CN`、`ja-JP`、`en-US` 等区域形式；未知值回退中文。右上角语言选择会更新 URL 并重新加载，保留其他查询参数与锚点。复制内容与当前语言一致，包括安装提示、4 个案例和 7 个模板。

翻译位于 `locales/ui.js` 和 `locales/prompts.js`，语言初始化位于 `i18n.js`。案例截图和第三方品牌图片保持原图。同步到 Byted 仓库时，打包资源清单需要包含 `i18n.js` 和 `locales/`；这些模块必须与 `main.js` 一起发布到静态资源目录。
