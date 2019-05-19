// pages/page/myCommunity/topics/topics.js
var Api = require('../../../../utils/api.js');
var util = require('../../../../utils/util.js');

var navList = [
  { id: "all", title: "全部" },
  { id: "good", title: "精华" },
  { id: "share", title: "分享" },
  { id: "ask", title: "问答" },
  { id: "job", title: "招聘" }
];

Page({
  data: {
    activeIndex: 0,
    navList: navList,
    title: '话题列表',
    postsList: [],
    hidden: false,
    page: 1,
    limit: 20,
    tab: 'all'
  },

  onLoad: function () {
  },

  
})
