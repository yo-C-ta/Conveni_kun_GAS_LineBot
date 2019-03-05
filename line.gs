var CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('APP_TOKEN');
var MAX_COLUMN = 10;
var CONVINI_TYPE = ['セブン','ファミマ','ローソン','ミニストップ'];
var FUNCTIONS = {
  'セブン': postSevenProducts,
  'ファミマ': postFamimaProducts,
  'ローソン': postLawsonProducts,
  'ミニストップ': postMinistopProducts
}

function doPost(e) {
  var reply_token= JSON.parse(e.postData.contents).events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }
  var user_message = JSON.parse(e.postData.contents).events[0].message.text;
  var cards;
  if (user_message.indexOf('新商品') != -1){
    CONVINI_TYPE.some(function(value) {
      if (user_message.indexOf(value) != -1){
        var term = user_message.indexOf('来週') != -1 ? '来週' : '今週';
        cards = FUNCTIONS[value](term);
        return true;
      }
    });
  }
  else {
    return;
  }

  var payload;
  if (cards === "null") {
    var notfound_text = "まだ発表されてないよ";
    payload = (
      {
        'replyToken': reply_token,
        'messages': [{
          'type': 'text',
          'text': notfound_text,
        }],
      }
    );
  }
  else {
    payload = (
      {
        'replyToken': reply_token,
        'messages': [{
          "type": "template",
          "altText": user_message + "の検索結果",
          "template": {
            "type": "carousel",
            "columns": cards
          }
        }],
      }
    );
  }

  var url = 'https://api.line.me/v2/bot/message/reply';
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify(payload),
  });

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
