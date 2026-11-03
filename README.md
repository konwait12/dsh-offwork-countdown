<p align="center">
  <img src="icon.svg" width="96" height="96" alt="dsh-offwork-countdown icon" />
</p>

<h1 align="center">dsh-offwork-countdown</h1>

<p align="center">页面右上角的下班倒计时小卡片 · 可拖动、可配置，给 DeepSeek Harness Web GUI 用</p>

一个 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) Web 界面挂件：在页面右上角显示一张**下班倒计时**小卡片——距离下班还剩多久、今天过了多少，顺手就能改上下班时间，卡片还能拖到任意位置。跟随宿主主题（明/暗）与中英文界面。

> A draggable off-work countdown card for the DeepSeek Harness Web GUI. Shows the remaining time and day progress, keeps its own work-hour settings on this device, and remembers where you dragged it.

## 卡片长什么样

```
┌──────────────────────────────────────┐
│ ◔  距离下班              03:12:45 – ⚙ │
│ 09:00 – 18:00 · 周三            62%  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░                 │
└──────────────────────────────────────┘

小胶囊（收起的形态）：  ◔ 03:12:45 ▬▬▬
```

- 大号等宽倒计时 `HH:MM:SS`，每秒更新
- 今日进度条 + 百分比
- 状态自动切换：上班前 · 工作中 · 已下班（变绿，显示已下班时长）· 休息日（提示下个工作日）
- 点右上角滑杆图标，卡片内直接改「上班时间 / 下班时间 / 仅工作日」，保存后立即生效
- **大小两档**：点「收起」缩成一颗小胶囊（`◔ 03:12:45 ▬▬▬`），点胶囊展开回卡片，选择会被记住
- **右侧面板联动**：打开右侧面板时，卡片自动变成小胶囊并让到面板左侧，不遮挡面板内容；关掉面板后恢复原来的大小
- 按住卡片即可拖动（小胶囊也可以拖，单击才是展开），位置会被记住并始终限制在窗口内；没拖动过时默认吸附右上角偏下（避让顶部工具栏）
- 文案走宿主 locale 服务，中英文自动切换

## 安装

前提：已安装 DeepSeek Harness，并使用 Web 界面（`dsh web` 启动后打开的页面）。

### 方式一：从 GitHub 安装（推荐）

```bash
dsh plugin --profile web add github:konwait12/dsh-offwork-countdown
```

安装后重启 `dsh web`（或重新打开 Harness）。若「设置 → 插件」里还没启用，手动打开一次即可。

### 方式二：本地目录开发安装

```bash
git clone https://github.com/konwait12/dsh-offwork-countdown.git
dsh plugin --profile web add link:/absolute/path/to/dsh-offwork-countdown
```

链接安装后修改 `client.js` 会被宿主的热更新链路拾取（个别情况需要刷新页面）。

## 使用

- **改时间**：点卡片右上角的滑杆图标 → 填上下班时间 → 保存。默认 `09:00 – 18:00`，仅统计周一到周五。
- **收起 / 展开**：点右上角「收起」变成小胶囊；单击胶囊（不是拖动）展开。
- **移动**：按住卡片或小胶囊拖动；松手后位置保存在本机，下次打开还在原处。窗口缩小时会自动拉回可见区域。
- **右侧面板**：打开右侧面板时卡片会自动变胶囊并移到面板左边；右侧面板全屏时卡片暂时隐藏。
- **恢复默认时间**：设置面板里的「恢复默认」。
- 想停用：设置 → 插件里关闭「下班倒计时」，或 `dsh plugin --profile web remove dsh-offwork-countdown`。

## 数据存储

所有数据只保存在本机浏览器 `localStorage`，不上传：

| key | 内容 |
| --- | --- |
| `dsh.offwork-countdown.v1` | 上班/下班时间、是否仅工作日 |
| `dsh.offwork-countdown.position.v1` | 拖动后的卡片位置 |
| `dsh.offwork-countdown.compact.v1` | 是否收起为小胶囊 |

## 兼容性

在 DSH `0.2.1-rc.2` 的 `web` profile 上开发与验证。依赖宿主提供的 `shell.overlay` 槽位与客户端 locale 服务；如果未来宿主重命名或移除该槽位，卡片将不再出现，需要相应调整。

## 项目结构

本仓库本身就是一个可直接安装的 DSH bundle 包，没有构建步骤：

| 文件 | 作用 |
| --- | --- |
| `index.js` | Host 半侧：一个空 `apply()`，让 bundle 作为可管理插件存在 |
| `client.js` | 浏览器半侧：`window.__ModuleLoader__` 注册、向 `shell.overlay` 槽位注册卡片、所有渲染与交互逻辑 |
| `cordis.patch.yml` | 把插件行插入 profile 配置 |
| `locale/zh.json`、`locale/en.json` | 插件列表里显示的标题/描述 |
| `icon.svg` | 插件图标（原创） |

纯 JavaScript + React（宿主提供），不引入任何额外依赖，也不 `require` 宿主内部模块；样式只用宿主的 `--dsw-*` 主题 token。

## License

[MIT](LICENSE)
