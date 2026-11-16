'use strict';
// V42 · Only verified, place-matched photos published by the property/market operator,
// its parent company, its official local visitor authority, or an owner-issued press release.
// The remote image is NOT redistributed in this ZIP; the site loads it online.
// [image URL, official source URL, displayed source, source type]
const SHOPPING_OFFICIAL_PHOTOS = Object.freeze({
  'CF Toronto Eaton Centre': [
    'https://assets.cadillacfairview.com/transform/83c76ab2-935a-438a-a2bc-9eeb865608e6/TEC-3-level-shot',
    'https://cadillacfairview.com/retail/properties/cf-toronto-eaton-centre/', 'Cadillac Fairview', '商场业主官网'
  ],
  'Outlet Collection at Niagara': [
    'https://www.outletcollectionatniagara.com/media/v1/364/2022/08/center_court.jpg',
    'https://www.outletcollectionatniagara.com/gallery/', 'Outlet Collection at Niagara', '商场官网图库'
  ],
  'CF Rideau Centre': [
    'https://assets.cadillacfairview.com/transform/fa5798ea-b2ed-431c-b936-d1c9b2c331dd/-Retail-CF-Rideau-centre-Canada-Goose?io=transform%3Afill%2Cwidth%3A1600&quality=80',
    'https://cadillacfairview.com/retail/properties/cf-rideau-centre/', 'Cadillac Fairview', '商场业主官网'
  ],
  'Champlain Place': [
    'https://mma.prnewswire.com/media/2545218/Westcliff_Management_Ltd_Westcliff_Announces_Acquisition_of_New.jpg?p=twitter',
    'https://westcliff.ca/en/building/champlainplace/', 'Westcliff', '业主官方发布图片'
  ],
  'Avalon Mall': [
    'https://www.crombie.ca/wp-content/uploads/2021/04/AvalonMall092021-11-1-2-975x650.jpg',
    'https://www.crombie.ca/property/avalon-mall/', 'Crombie', '商场业主官网'
  ],
  'Distillery Historic District': [
    'https://www.thedistillerydistrict.com/wp-content/uploads/2021/07/Distillery-District-13.jpg',
    'https://www.thedistillerydistrict.com/gallery/', 'Distillery District', '街区官网图库'
  ],
  'ByWard Market': [
    'https://images.squarespace-cdn.com/content/v1/60bed59745a00c322d46a862/1695611711877-9FGURXR2KOJOK2SYRNZG/CC%2BNight%2BMarket-46%2B%281%29.jpg',
    'https://www.byward-market.com/news/a-market-marathon-not-a-quick-trip', 'ByWard Market District Authority', '市集运营方官网'
  ],
  'Jean-Talon Market': [
    'https://www.marchespublics-mtl.com/sites/default/files/styles/cropped_1000x632/public/blocks/635/marche-jean-talon-drapeau-du-quebec.jpeg?itok=y7mKa-8U',
    'https://www.marchespublics-mtl.com/en/markets/jean-talon-market', 'Marchés publics de Montréal', '市集官网'
  ],
  'Marché Atwater 食品市集': [
    'https://www.marchespublics-mtl.com/sites/default/files/styles/focal_point_cropped/public/merchant/461/atwjuillet2022cbodoum-52.jpg?h=02fd1b3e&itok=BjZfSXd6',
    'https://www.marchespublics-mtl.com/en/markets/atwater-market', 'Marchés publics de Montréal', '市集官网'
  ],
  'Rue du Petit-Champlain': [
    'https://www.quebec-cite.com/sites/otq/files/styles/gallery_desktop/public/media/image/boutique_petit_champlain_0.jpg?itok=zAJYXzNq',
    'https://www.quebec-cite.com/en/old-quebec-city/petit-champlain', 'Visit Québec City', '目的地官方旅游局'
  ],
  'PEI Craft Council Gallery': [
    'https://images.squarespace-cdn.com/content/v1/5aa00e919d5abba648e0afd7/1562088287353-BQ5KYVQCJKW3WLDAYRBO/IMG_0217.JPG?format=1000w',
    'https://www.peicraftscouncil.com/about-us', 'PEI Crafts Council', '机构官网'
  ],
  'Dieppe Market': [
    'https://images.squarespace-cdn.com/content/v1/5c61765665a70748a39ed6a1/1596110824586-GMIK610Q7D8FTSZ46GPR/IMG_8624.jpg?format=2500w',
    'https://www.marchedieppemarket.com/really-local-markets-blog', 'Marché Dieppe Market', '市集官网'
  ],
  'St. John’s Farmers’ Market': [
    'https://sjfm.ca/static/media/home-hero66.2ee0eb044f5bd1459cc4.png',
    'https://sjfm.ca/', 'St. John’s Farmers’ Market', '市集官网'
  ]
});
