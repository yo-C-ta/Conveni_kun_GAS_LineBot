// ----------------------------------------------------------------------------
// Post Lawson Products
//
// ローソン新商品取得
// http://www.lawson.co.jp/recommend/new/
// ----------------------------------------------------------------------------

var LAWSON_TERMS = {
  '発表日以前今週': 'thispage',
  '発表日以降今週': 'prvpage',
  '発表日以降来週': 'thispage'
};
var LAWSON_PUB_DAY = 5;
var LAWSON_BASE_URL = 'http://www.lawson.co.jp';
var LAWSON_GOODS_DIR = '/recommend/new/';

function postLawsonProducts(term) {
  var dt = new Date();
  if (0 < dt.getDay() && dt.getDay() < LAWSON_PUB_DAY) {
    term = '発表日以前' + term;
  }
  else {
    term = '発表日以降' + term;
  }

  if (term == '発表日以前来週') {
    return "null";
  }

  var url = lawsonURL(LAWSON_TERMS[term]);
  return makeLawsonAttachments(url);
}

function lawsonURL(page) {
  var url = LAWSON_BASE_URL + LAWSON_GOODS_DIR;
  var html = UrlFetchApp.fetch(url).getContentText();

  if (page == 'prvpage') {
    url = LAWSON_BASE_URL + html.match(/<li><a href="([^"]+)">[0-9]+\/[0-9]+発売<\/a><\/li>/)[1];
  }

  return url
}

function makeLawsonAttachments(url) {
  var cards = [];
  var html = UrlFetchApp.fetch(url).getContentText();
  var items = Parser.data(html).from('<p class="img">').to('</li>').iterate();
  var cardsize = items.length;
  if (cardsize <= 1) return "null";
  if (cardsize >= MAX_COLUMN) cardsize = MAX_COLUMN;
  for (var i = 0; i < cardsize; i++) {
    var link = LAWSON_BASE_URL + items[i].match(/<a href="(.+?)">/)[1];
    var image = items[i].match(/<img src="([^"]+)" width=/)[1];
    var name = items[i].match(/<p class="ttl">(.+?)<\/p>/)[1];
    var price = items[i].match(/<p class="price"><span>(.+?)<\/span><\/p>/)[1].replace('</span><span>', '');
    var launch = items[i].match(/<p class="date">(.+?)<\/span><\/p>/)[1].replace('<span>', '');
    var calory = items[i].match(/<p>(.+?)<\/p>/) ? items[i].match(/<p>(.+?)<\/p>/)[1] : "";

    var card = (
      {
        "thumbnailImageUrl": image,
        "title": name,
        "text": price + "\n" + launch + "\n" + calory,
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
