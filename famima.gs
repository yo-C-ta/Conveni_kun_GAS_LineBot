// ----------------------------------------------------------------------------
// Post Famima Products
//
// ファミリーマート新商品取得
// http://www.family.co.jp/goods/newgoods.html
// ----------------------------------------------------------------------------

var FAMIMA_TERMS = {
  '今週': 'newgoods',
  '来週': 'newgoods/nextweek'
};
var FAMIMA_BASE_URL = 'http://www.family.co.jp';
var FAMIMA_GOODS_DIR = '/goods/';

function postFamimaProducts(term) {
  var url = famimaURL(FAMIMA_TERMS[term]);
  return makeFamimaAttachments(url);
}

function famimaURL(term) {
  return FAMIMA_BASE_URL + FAMIMA_GOODS_DIR + term + '.html';
}

function makeFamimaAttachments(url) {
  var cards = [];
  var html = UrlFetchApp.fetch(url).getContentText();
  var items = Parser.data(html).from('<div class="ly-mod-infoset4 js-imgbox-size-rel ">').to('</p> </a>').iterate();
  var cardsize = items.length;
  if (cardsize <= 1) return "null";
  if (cardsize >= MAX_COLUMN) cardsize = MAX_COLUMN;
  for (var i = 0; i < cardsize; i++) {
    var link = FAMIMA_BASE_URL + items[i].match(/<a href="(.+?)" class="ly-mod-infoset4-link">/)[1];
    var image = FAMIMA_BASE_URL + items[i].match(/src="([^"]+)" alt="/)[1];
    image = UrlShortener.Url.insert({ longUrl: image }).id;
    var name = items[i].match(/<h3 class="ly-mod-infoset4-ttl">\n\s*(.+?)\n*\s*<\/h3>/)[1];
    var category = items[i].match(/<p class="ly-mod-infoset4-cate">\n\s*(.+?)<\/p>/)[1];
    var price = items[i].match(/<p class="ly-mod-infoset4-txt">\n\s*(.+?<br>\n\t*<span>.+?)<\/span>/)[1].replace(/<br>\n\t*<span>/, '');

    var card = (
      {
        "thumbnailImageUrl": image,
        "title": name,
        "text": price,
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
