// NAME: JavDB App 去广告
// AUTHOR: lesspem
// REPO: https://github.com/lesspem/Surge
// DESC: 清空 JavDB App 的开屏广告、首页/磁链广告位

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
    // 开屏广告 /api/v1/startup
    if (url.indexOf('/api/v1/startup') !== -1) {
      if (obj.data.splash_ad) {
        obj.data.splash_ad.enabled = false;
        obj.data.splash_ad.ad = null;
      }
    }
    // 首页顶部 / 磁链页广告 /api/v1/ads
    else if (url.indexOf('/api/v1/ads') !== -1) {
      obj.data.enabled = false;
      obj.data.ads = {};
    }
  }

  $done({ body: JSON.stringify(obj) });
})();
