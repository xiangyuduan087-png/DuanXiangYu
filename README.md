# 段翔宇的个人作品集

现有 Next.js 16 / React 19 / TypeScript 项目改造为电脑端纵向单页。首页、设计、视频、关于我、联系我依次排列；首页四个主入口只进行页内滚动；作品集查看与下载保留在关于我区域。仅本地实现，没有部署。

## 启动

```sh
pnpm dev
pnpm build
pnpm start
```

本地地址 http://127.0.0.1:3000 。也可使用 `node node_modules/next/dist/bin/next build` 与 `start --hostname 127.0.0.1`。

## 内容管理

- `content/profile.ts`：依据作品集第 2 页整理真实个人资料，集中配置电话、邮箱及扫码入口。
- `content/documents.ts`：集中配置作品集与简历 PDF；作品集已原样复制，独立简历仍为 null。
- `content/bilibili-matches.json`：2026-10-12 核验的固定投稿标题与各集链接，15 个项目共 19 个成片／分集；未匹配的 CENTELLA UGC 保留原名与本地播放。网站不实时抓取 B 站。核对表见 `imports/B站视频核对表.md` / `.csv`。
- `content/design-display.json`：设计展示编号及指定隐藏海报，保留原始文件和稳定 ID。
- 将真实PDF放到 `public/documents/portfolio.pdf` / `resume.pdf`，配置网页路径 `/documents/portfolio.pdf` / `/documents/resume.pdf` 与文件名；入口会在新标签页打开。详见 `imports/PDF说明.md`。
- `content/imported-projects.json`：实际作品、分集与制作素材；页面展示和作品数据分离。

源目录保持不变：`C:\Users\PC\Desktop\设计类`、`C:\Users\PC\Desktop\视频整合`。现有393个文件均保留关联，稳定ID和网页资源路径不变。设计46张图片归为44个项目；20个成片归为16个视频项目，287张过程图片和40份文本按项目及分集展示。所有含“参考”的设计图均正常纳入。

唯一主分类严格按照源目录：

| 设计 | 项目数 | 视频 | 项目数 |
|---|---:|---|---:|
| 海报 | 11 | TVC种草 | 5 |
| Banner | 9 | 剧集 | 4 |
| IP | 1 | 娱乐向 | 2 |
| 字体 | 17 | 影游 | 1 |
| 图标 | 4 | 短片 | 4 |

内容类型等旧标签仅可作为内部信息，不能扩展主分类。

```powershell
python scripts/inspect_sources.py
python scripts/import_works.py
```

导入器末尾会运行 `scripts/single-page-data.py`，统一文件夹分类、视频脚本命名及清单。重复导入不生成重复项目或资源。已有素材不需再次导入，单独更新命名/分类时运行 `python scripts/single-page-data.py`。

## 清单

- `imports/manifest.csv` / `.json`：逐文件原路径、项目、唯一主分类、用途、网页资源路径。
- `imports/video-names.csv` / `.json`：视频旧名称→新名称→完整剧本与分镜来源，包含命名原文依据。
- `imports/decisions.json`：分组与分类依据。
- `imports/summary.json`：当前项目和分类数量。
- `imports/script-audit.json`：已读取的40份脚本与字符数。

导入清单保留历史剧本来源；当前展示名称优先应用content/bilibili-matches.json中已核验的投稿与分集原名。四组连续剧集与资产关联保持不变。

## 单页交互

首页四个入口围绕角色排列；不再使用固定侧导航。标题与页尾按钮返回首页。开屏保持约4.55秒的角色显现、局部眼睑睁眼与眼睛跟随衔接，支持跳过及减少动态效果；返回首页不重播。

一级分类采用十张独立4:3 SVG封面和缓慢旋转圆环。封面配置位于 `content/category-covers.ts`，生成脚本为 `scripts/make-category-covers.py`。卡片中心与可见轨迹共用同一套几何计算，悬停和键盘聚焦暂停，离开恢复，隐藏页面停止动画。

分类内直接显示全部作品的自适应网格，不分页、不旋转；IP以同一项目的三张展示图呈现网格，详情在三图间切换。详情弹层在当前分类顺序内切换，左右键和可见按钮支持上一件、下一件，边界禁用、不循环。多图仍属于同一项目。内部正文优先滚动；到达边界后须开始新的滚轮手势，累计110像素才切换，每次手势最多一次（280ms安静间隔划分手势）。播放器、输入、脚本文本及图片放大层不截获。切换与关闭暂停视频，关闭恢复原卡片位置和焦点；遮罩空白与Esc也可关闭。

分类与详情记录在URL查询参数，支持浏览器前进、后退。视频主动播放、preload none，具有声音、进度、全屏及分集切换；制作素材按集展开。关于我使用真实照片 `public/images/portrait.png`；个人栏只在关于我区域内sticky，窄窗口上下排布。PDF原文件与原照片保持字节一致。
旧 `/design`、`/video`、`/about`、`/about#contact` 与 `/work/稳定ID` 会进入单页对应区域或详情，不丢失旧作品链接。

## 验证

构建和TypeScript通过。最近一轮验收脚本：

```powershell
$env:NODE_PATH='C:\Users\PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
node scripts/verify-local-refresh.cjs
node scripts/verify-refresh-interactions.cjs
node scripts/verify-category-orbit.cjs
```

实际窗口覆盖1280×720、1440×900、1920×1080、768×1024、390×844。测试报告与截图存放在忽略上传的 `verification/`。真实浏览器80%、100%、125%、200%缩放测试使用经本人许可的独立测试配置，仅用于验收，不影响日常浏览器。

## 尚缺资料

独立简历PDF；各项目的真实职责、制作工具及成果数据。未确认的CENTELLA UGC视频不绑定推测的B站标题或链接。作品集PDF、个人事实、联系方式与两个二维码已配置。

最近调整说明：imports/字体IP与窄屏调整.md。700px及以下一级分类使用静态两列网格，电脑端保留分类圆环。字体详情按图片比例自适应高度。

最新观看体验：imports/观看体验与图片缩放.md。首页展示标题、顶部四栏目目录、分类内标签，以及原图缩放/拖动查看均已实现；仅本地运行。
