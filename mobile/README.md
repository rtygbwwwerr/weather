# 风迹手机版

基于 ../public/index.html 复用预报功能。src/mobile.css 和 mobile.js 提供手机交互；Android / iOS 使用 Capacitor，浏览器提供主屏幕 Web App。

构建：`npm ci`，然后 `npm run build`。原生工程同步：`npm run sync`。

网页发布：将 www 的内容复制到 ../public/mobile，再从 weather 根目录部署 Netlify。入口为 /mobile/。不要只部署 www 到现有站点根目录，否则会替换桌面版。

iPhone：Safari 打开 /mobile/，分享 → 添加到主屏幕 → 若显示“作为网页 App 打开”则开启 → 添加。

缓存只覆盖界面资源；预报和地图仍需联网，不把旧预报冒充实时预报。

原生工程已生成，但尚未编译签名或真机测试。Android 需要 Android Studio、SDK 36 及对应 JDK；iOS 需要 Mac、Xcode 和 Apple 签名。
