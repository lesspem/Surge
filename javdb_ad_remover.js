// JavDB ad-remover (Surge http-response)
// 屏蔽：启动广告、公告弹窗、請注意弹窗、首页顶部轮播广告、磁链页广告
// 广告/弹窗均由 apidd.spthgb.com 下发：
//   /api/vN/ads      -> banner/信息流广告槽（首页轮播 index_top、磁链页 magnets_top / web_magnets_top）
//   /api/v1/startup  -> 启动广告 splash_ad、公告弹窗 UPDATE_DESCRIPTION、請注意弹窗 NOTICE
// 不拒绝接口（App 仍需 startup 的 backup_domains/settings 等数据），只置空广告与弹窗载荷。

const ADS_RE = /^https?:\/\/apidd\.spthgb\.com\/api\/v\d+\/ads(\?|$)/i;
const STARTUP_RE = /^https?:\/\/apidd\.spthgb\.com\/api\/v\d+\/startup(\?|$)/i;

function neutralizeAds(body) {
  const obj = JSON.parse(body);
  if (obj && obj.data) {
    obj.data.enabled = false;            // 关闭整个广告系统
    if (obj.data.ads) {
      for (const key of Object.keys(obj.data.ads)) {
        obj.data.ads[key] = [];          // 清空每个广告槽（首页轮播/磁链页等）
      }
    }
  }
  return JSON.stringify(obj);
}

function neutralizeStartup(body) {
  const obj = JSON.parse(body);
  if (obj && obj.data) {
    // 启动广告
    if (obj.data.splash_ad) {
      obj.data.splash_ad.enabled = false;
      obj.data.splash_ad.ad = null;
    }
    // 公告弹窗（更新公告）与 請注意弹窗
    if (obj.data.settings) {
      obj.data.settings.UPDATE_DESCRIPTION = "";
      obj.data.settings.NOTICE = "";
    }
  }
  return JSON.stringify(obj);
}

(function main() {
  const url = $request.url;
  console.log("[javdb-ad] fired: " + url);   // 调试用：在 Surge 脚本日志可见；确认无误后可删除此行
  let body = $response.body;
  try {
    if (ADS_RE.test(url)) {
      body = neutralizeAds(body);
    } else if (STARTUP_RE.test(url)) {
      body = neutralizeStartup(body);
    }
  } catch (e) {
    // On parse failure leave the body untouched so the app never breaks.
    console.log("[javdb-ad] parse error: " + e);
  }
  $done({ body });
})();
