// pages/components/myTree/myTree.js
Component({
  /**
   * Component properties
   */
  properties: {
    model: Object,
  },

  /**
   * Component initial data
   */
  data: {
    isBranch: false,
  },

  /**
   * Component methods
   */
  methods: {
    toggle: function (e) {
      if (this.data.isBranch) {
        this.setData({
          
        })
      }
    },
    tapItem: function (e) {
      var itemid = e.currentTarget.dataset.itemid;
      console.log('组件里点击的id: ' + itemid);
      this.triggerEvent('tapitem', { itemid: itemid }, { bubbles: true, composed: true });
    }
  },
  ready: function (e) {
    this.setData({
      isBranch: Boolean(this.data.model.nodes && this.data.model.nodes.length),
    });
    console.log(this.data);
  },

})
