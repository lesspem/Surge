// NAME: JavDB App 去广告 & 去公告
// AUTHOR: lesspem
// REPO: https://github.com/lesspem/Surge
// DESC: 清空 JavDB App 的开屏广告、首页/磁链广告位、启动公告弹窗

(() => {
  const url = $request.url;
  let obj;

  try {
    obj = JSON.parse($response.body);
  } catch (e) {
    $done({});
    return;
  }

  if (obj && obj.data) {
    // /api/v1/startup: 移除开屏广告 + 公告
    if (url.indexOf('/api/v1/startup') !== -1) {
      // 整个 splash_ad 结构删掉，让 App 直接跳过开屏流程
      // （仅置 enabled=false 时 App 仍会渲染空白占位并跑 1-4 秒倒计时）
      delete obj.data.splash_ad;

      if (obj.data.settings) {
        // 删除键而非置空字符串，避免 App 仍弹出公告框
        delete obj.data.settings.NOTICE;
        delete obj.data.settings.UPDATE_DESCRIPTION;
      }
    }
    // /api/v1/ads: 清空首页顶部 / 磁链页广告
    else if (url.indexOf('/api/v1/ads') !== -1) {
      obj.data.enabled = false;
      obj.data.ads = {};
    }
  }

  $done({ body: JSON.stringify(obj) });
})();
