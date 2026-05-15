# 发布成可分享网页（尽量少操作）

你的游戏是纯静态文件（`index.html` + `game.js` + `style.css` + `assets/`），适合 **GitHub Pages**：免费、HTTPS、一条链接全世界能打开。

## 你只需要做这几步

1. 打开 [GitHub](https://github.com) 登录，点 **New repository**，新建一个空仓库（例如 `my-fighter-game`），**不要**勾选添加 README。
2. 在本机终端进入本文件夹：

   ```bash
   cd "/Users/william/Desktop/my code"
   git init
   git add index.html game.js style.css assets .github .gitignore DEPLOY.md
   git commit -m "Add game and GitHub Pages deploy"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

   若你还想把 `backup/` 也备份进仓库，把上一行里的 `git add` 改成 `git add .` 即可（网站会一起上传，体积更大）。

3. 在 GitHub 打开该仓库 → **Settings** → **Pages** → **Build and deployment** → **Source** 选 **GitHub Actions**（不要选 Branch）。
4. 等几分钟：仓库页 **Actions** 里绿色勾出现后，再到 **Settings → Pages** 里会显示 **Visit site** 地址，一般是：

   `https://你的用户名.github.io/仓库名/`

把这个链接发给别人即可。

## 以后改游戏

改完代码后在本目录执行：

```bash
git add -A
git commit -m "Update game"
git push
```

Actions 会自动重新部署，刷新网页即可（必要时改大 `index.html` 里 `game.js?v=` 的数字防缓存）。

## 不想用 GitHub？

把本文件夹拖到 [Netlify Drop](https://app.netlify.com/drop) 也能立刻得到一个 `https://xxx.netlify.app` 链接，无需写配置。
