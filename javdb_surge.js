// JavDB App ad-remover (Surge http-response, 端口自验证可用的 QX javdbapp.js)
// 调试日志：[javdb-ad] fired / parse error —— 看 Surge 脚本日志确认是否触发
(() => {
  const url = $request.url;
  let obj;
  try {
    obj = JSON.parse($response.body);
  } catch (e) {
    console.log('[javdb-ad] parse error (MITM 未解密?): ' + url);
    $done({});
    return;
  }
  console.log('[javdb-ad] fired: ' + url);
  if (obj && obj.data) {
    // /api/v1/startup: 删除开屏广告 + 公告/請注意弹窗（删键而非置空）
    if (url.indexOf('/api/v1/startup') !== -1) {
      delete obj.data.splash_ad;
      if (obj.data.settings) {
        delete obj.data.settings.NOTICE;
        delete obj.data.settings.UPDATE_DESCRIPTION;
      }
    }
    // /api/v1/ads: 清空首页顶部 / 磁链页广告位
    else if (url.indexOf('/api/v1/ads') !== -1) {
      obj.data.enabled = false;
      obj.data.ads = {};
    }
  }
  $done({ body: JSON.stringify(obj) });
})();
