# 快速开始指南

## 🎯 3步获得与云展网一模一样的效果

### 第1步：准备图片（2分钟）

1. **从PDF/PPT导出图片**
   - 在线工具：https://smallpdf.com/cn/pdf-to-jpg
   - 或使用 Adobe Acrobat、WPS 导出

2. **重命名图片**
   ```
   pages/
   ├── cover.jpg      # 封面
   ├── page-1.jpg     # 第1页
   ├── page-2.jpg     # 第2页
   ├── page-3.jpg     # 第3页
   └── back.jpg       # 封底
   ```

3. **压缩图片**（重要！）
   - 使用 https://tinypng.com/ 压缩
   - 单张图片不超过 500KB

---

### 第2步：本地测试（1分钟）

双击打开 `index.html`，您会看到：
- ✅ 深色背景的专业阅读器界面
- ✅ 顶部搜索框
- ✅ 底部完整工具栏（放大、缩略图、自动播放、翻页等）
- ✅ 右侧翻页箭头按钮
- ✅ 右下角功能按钮（举报、声音、分享、全屏）
- ✅ 流畅的3D翻页动画

---

### 第3步：部署上线（2分钟）

#### 方案A：GitHub Pages（推荐）

```bash
# 1. 初始化Git
cd yunzhan-flipbook
git init
git add .
git commit -m "Initial commit"

# 2. 创建远程仓库（在github.com上手动创建）
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main

# 3. 启用Pages
# 进入仓库 → Settings → Pages → Branch: main → Save
```

获得永久链接：`https://你的用户名.github.io/仓库名/`

#### 方案B：Vercel（更简单）

1. 访问 https://vercel.com
2. 用GitHub登录
3. Import 项目
4. 点击 Deploy
5. 获得链接：`https://xxx.vercel.app`

---

## ✨ 完成！

现在您拥有一个**与云展网UI完全一致**的HTML5翻页电子书：

- 🎨 UI布局：100%复刻
- 📖 翻页效果：专业3D动画
- 🎮 交互功能：全部实现
- 💰 成本：完全免费
- 🔗 链接：永久有效

**分享给任何人，他们都能在手机/平板/电脑上完美浏览！**

---

## 💡 提示

- 图片质量直接影响加载速度，务必压缩
- 建议单页尺寸：900px × 1200px
- 如需修改内容，编辑 `index.html` 中的页面结构
- 详细定制教程见 `README.md`
