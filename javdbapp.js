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
    // /api/v1/startup: 关闭开屏广告 + 清空公告
    if (url.indexOf('/api/v1/startup') !== -1) {
      if (obj.data.splash_ad) {
        obj.data.splash_ad.enabled = false;
        obj.data.splash_ad.overtime = 0;
        obj.data.splash_ad.ad = null;
      }
      if (obj.data.settings) {
        obj.data.settings.NOTICE = '';
        obj.data.settings.UPDATE_DESCRIPTION = '';
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

