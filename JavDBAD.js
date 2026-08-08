/*************************************
JavDB 去广告 / 去开屏 / 去公告（v1.9.29 适配，自托管版）
========================================
适配说明：
  原公开脚本只匹配 api.pxxgg.xyz / api.ujvnmkx.cn / api.yijingluowangluo.xyz，
  而这三个域名在 v1.9.29 中已不存在，故旧脚本失效。
  本脚本去广告逻辑与域名无关（只按 URL 路径匹配 /ads、/startup）：

  /ads     → data.ads = {}                 去内部广告
  /startup → data.splash_ad.enabled=false  去开屏广告
           → data.splash_ad.overtime=0
           → data.splash_ad.ad={}
           → data.feedback.placeholder=""
           → data.settings.NOTICE=""        去启动公告

使用方式：配合 Surge / Quantumult X 的 [rewrite_local] script-response-body 调用本文件。
CNNMoney 注意：若新版 startup 的 JSON 结构变化，下面的字段路径需相应调整。
*************************************/

(function () {
  if (typeof $response === 'undefined' || !$response || !$response.body) {
    $done({});
    return;
  }
  try {
    var body = $response.body;
    var obj = JSON.parse(body);

    var url = ($request && $request.url) ? $request.url : '';
    var ada = '/ads';
    var adb = '/startup';

    // 横幅广告
    if (url.indexOf(ada) !== -1 && obj && obj.data) {
      obj.data.ads = {};
    }

    // 公告 + 开屏
    if (url.indexOf(adb) !== -1 && obj && obj.data) {
      if (!obj.data.splash_ad) obj.data.splash_ad = {};
      obj.data.splash_ad.enabled = false;
      obj.data.splash_ad.overtime = 0;
      obj.data.splash_ad.ad = {};
      if (obj.data.feedback) obj.data.feedback.placeholder = '';
      if (obj.data.settings) obj.data.settings.NOTICE = '';
    }

    $done({ body: JSON.stringify(obj) });
  } catch (e) {
    // 解析或字段异常时原样返回，避免 App 报错
    $done({});
  }
})();