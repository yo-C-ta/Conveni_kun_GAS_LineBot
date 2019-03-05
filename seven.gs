// ----------------------------------------------------------------------------
// Post Seven Products
//
// セブンイレブン新商品取得
// http://www.sej.co.jp/i/products/thisweek/?page=1&sort=f&limit=100
// ----------------------------------------------------------------------------

var MY_SEVEN_REGION = '東海';
var SEVEN_TERMS = {
  '今週': 'thisweek',
  '来週': 'nextweek'
};
var SEVEN_REGIONS = {
  '北海道': 'hokkaido',
  '東北': 'tohoku',
  '関東': 'kanto',
  '甲信越・北陸': 'koshinetsu',
  '東海': 'tokai',
  '近畿': 'kinki',
  '中国・四国': 'chugoku',
  '九州': 'kyushu'
};
var SEVEN_SORTS = {
  'おすすめ': 'f',
  '新商品': 'n'
};
var SEVEN_LIMITS = {
  '15件': 15,
  '50件': 50,
  '100件': 100
};
var SEVEN_BASE_URL = 'http://www.sej.co.jp';
var SEVEN_PRODUCTS_DIR = '/i/products/';

function postSevenProducts(term) {
  var query = sevenQuery(SEVEN_SORTS['新商品'], SEVEN_LIMITS['15件']);
  var url = sevenURL(SEVEN_TERMS[term], SEVEN_REGIONS[MY_SEVEN_REGION], query);
  return makeSevenAttachments(url);
}

function sevenQuery(sort, limit) {
  return '?page=1' + '&sort=' + sort + '&limit=' + limit;
}

function sevenURL(term, region, query) {
  return SEVEN_BASE_URL + SEVEN_PRODUCTS_DIR + term + '/' + region + query;
}

function makeSevenAttachments(url) {
  var cards = [];
  var html = UrlFetchApp.fetch(url).getContentText();
  var items = Parser.data(html).from('<li class="item">').to('</div>\n</li>').iterate();
  var cardsize = items.length;
  if (cardsize <= 1) return "null";
  if (cardsize >= MAX_COLUMN) cardsize = MAX_COLUMN;
  for (var i = 0; i < cardsize; i++) {
    var link = SEVEN_BASE_URL + items[i].match(/<a href="(.+)">/)[1];
    var image = items[i].match(/img data-original="([^"]+)" alt="商品画像"/)[1];
    image = UrlShortener.Url.insert({ longUrl: image }).id;
    var name = items[i].match(/<div class="itemName">.+">(.+?)<\/a><\/strong>/)[1];
    var price = items[i].match(/<li class="price">(.+?)<\/li>/)[1];
    var launch = items[i].match(/<li class="launch">(.+?)<\/li>/)[1];
    var region = items[i].match(/<li class="region">(.+?)<\/li>/)[1].replace('<em>販売地域</em>', '');

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
