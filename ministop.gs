// ----------------------------------------------------------------------------
// Post Ministop Products
//
// ミニストップ新商品取得
// https://www.ministop.co.jp/syohin/js/recommend.json
// ----------------------------------------------------------------------------

var MY_MINISTOP_REGION = ['東海', '全国'];
var MINISTOP_BASE_URL = 'https://www.ministop.co.jp';
var MINISTOP_PRODUCTS_DIR = '/syohin/js/recommend.json';

function postMinistopProducts(term) {
  if (term === '来週') {
    return "null";
  }
  var url = MINISTOP_BASE_URL + MINISTOP_PRODUCTS_DIR;
  return makeMinistopAttachments(url);
}

function checkMinistopRegion(region) {
  return MY_MINISTOP_REGION.some(function(value){
    return (region === value);
  });
}

function makeMinistopAttachments(url) {
  var cards = [];
  var json = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  for (var i = 0, cardsize = 0; (i < json.length) && (cardsize < MAX_COLUMN); i++) {
    var link = MINISTOP_BASE_URL + json[i]["link"];
    var image = MINISTOP_BASE_URL + json[i]["image"];
    var name = json[i]["title"];
    var price = json[i]["price"];
    var launch = json[i]["release"];
    var region = json[i]["region"];
    if (!checkMinistopRegion(region)) {
      continue;
    }
    cardsize++;

    var card = (
      {
        "thumbnailImageUrl": image,
        "title": name,
        "text": price + "\n" + launch + "\n" + region,
        "actions": [
          {
            "type": "uri",
            "label": "くわしく！",
            "uri": link
          }
        ]
      }
    );
    cards.push(card);
  }

  return cards;
}
