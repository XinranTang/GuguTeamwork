// components/canvas-drag/index.js
// 修改demo添加了类似树状的相关基本功能，based from:https://github.com/wxa-component/wxa-comp-canvas-drag
// 添加图片、旋转、放大缩小是原demo内容，未做改动
// 跟树比较相关的方法和变量：dragGraph、edgeGraph、paint()、draw()、start(e)、move(e)、addNew()、_insertNode()、initByTree()
// 组件比较相关的成员：drawArr、edgeArr

const DELETE_ICON = './icon/close.png'; // 删除按钮
const DRAG_ICON = './icon/scale.png'; // 缩放按钮
const ADD_ICON = './icon/add.png'
const ROTATE_ENABLED = false;
var DEFAULT_FONT_SIZE = 15;
var ZOOM_ENABLE = false;
var ADD_ENABLE = false;
var DEL_ENABLE = false;

var SELECT_COLOR = 'rgba(135, 201, 237,0.8)';
var DEFAULT_COLOR = 'rgba(180,180,180,0.8)';
var DEL_COLOR = 'rgba(200,0,0,0.8)';

var initX =150;
var initY = 50;

// 服务器数据库字段名
var TREE = 'Tree';
var TREE_NAME = 'TreeName';
var TREE_ID = 'TreeID';
var TASK = 'Task';
var TASK_ID = 'TaskID';
var TITLE = 'Title';
var PUSHER = 'Pusher';
var CONTENT = 'Content';
var STATUS = 'Status';
var PUSH_DATE = 'PushDate';
var DEADLINE = 'DeadLine';
var URGENCY = 'Urgency';
var SELF = 'Self';
var CHILD = 'Child';
var TEAM_MATES = 'TeamMates'


const DEBUG_MODE = false; // 打开调试后会渲染操作区域边框（无背景时有效）
// attrs就是传入数据库字段
const dragGraph = function({
  x = 30,
  y = 30,
  w,
  h,
  type,
  text,
  fontSize = DEFAULT_FONT_SIZE,
  color = 'black',
  url = null,
  rotate = 0,
  sourceId = null,
  selected = true
}, canvas, factor, taskattrs = {}) {
  if (type === 'text') {
    canvas.setFontSize(fontSize);
    const textWidth = canvas.measureText(text).width;
    const textHeight = fontSize + 10;
    this.centerX = x + textWidth / 2;
    this.centerY = y + textHeight / 2;
    this.w = textWidth;
    this.h = textHeight;
    this.taskattrs = taskattrs;
  } else {
    this.centerX = x + w / 2;
    this.centerY = y + h / 2;
    this.w = w;
    this.h = h;
  }

  this.x = x;
  this.y = y;

  // 4个顶点坐标
  this.square = [
    [this.x, this.y],
    [this.x + this.w, this.y],
    [this.x + this.w, this.y + this.h],
    [this.x, this.y + this.h]
  ];

  this.fileUrl = url;
  this.text = text;
  this.fontSize = fontSize;
  this.color = color;
  this.ctx = canvas;
  this.rotate = rotate;
  this.type = type;
  this.selected = selected;
  this.factor = factor;
  this.sourceId = sourceId;
  this.MIN_WIDTH = 20;
  this.MIN_FONTSIZE = 10;
  // 增加了childs列表，里面的成员都是dragGraph对象
  this.childs = [];
  // 增加了isDeled属性，表示被标记为删除
  this.isDeled = false;
};

dragGraph.prototype = {
  /**
   * 绘制元素
   */
  paint() {
    this.ctx.save();
    this.text = this.taskattrs[TASK][TITLE];
    // 由于measureText获取文字宽度依赖于样式，所以如果是文字元素需要先设置样式
    let textWidth = 0;
    let textHeight = 0;
    if (this.type === 'text') {
      this.ctx.setFontSize(this.fontSize);
      this.ctx.setTextBaseline('middle');
      this.ctx.setTextAlign('center');
      //标记为删除的元素为红色
      this.ctx.setFillStyle(this.isDeled ? DEL_COLOR : this.color);
      textWidth = this.ctx.measureText(this.text).width;
      //textWidth = this.w;
      textHeight = this.fontSize + 10;
      // 字体区域中心点不变，左上角位移
      this.x = this.centerX - textWidth / 2;
      this.y = this.centerY - textHeight / 2;
    }

    // 旋转元素
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate(this.rotate * Math.PI / 180);
    this.ctx.translate(-this.centerX, -this.centerY);

    // 判断是否超出边界,出界自动弹回
    if (this.centerX > this.toPx(750)) {
      this.centerX = this.toPx(700);
      this.x = this.centerX - textWidth / 2;
    } else if (this.centerX < this.toPx(0)) {
      this.centerX = this.toPx(50);
      this.x = this.centerX - textWidth / 2;
    }

    if (this.centerY > this.toPx(750)) {
      this.centerY = this.toPx(700);
      this.y = this.centerY - textHeight / 2;
    } else if (this.centerY < this.toPx(0)) {
      this.centerY = this.toPx(50);
      this.y = this.centerY - textHeight / 2;
    }

    this.ctx.setShadow(0, 0, 20, this.isDeled?DEL_COLOR:this.selected?SELECT_COLOR:DEFAULT_COLOR);
    // this.ctx.shadowColor = this.isDeled ? DEL_COLOR : this.selected ? SELECT_COLOR : DEFAULT_COLOR;
    // this.ctx.shadowBlur = 20.0;
    // this.ctx.shadowOffsetX = 0;
    // this.ctx.shadowOffsetY = 0;
    // console.log(this.ctx);
    this._roundRect(this.x - 5, this.y - 5, textWidth + 10, textHeight + 10, 10);
    //this.ctx.fillRect(this.x - 5, this.y - 5, textWidth + 10, textHeight + 10);
    this.ctx.setShadow(0, 0, 0, 'black');
    // 渲染元素
    if (this.type === 'text') {
      this.ctx.fillText(this.text, this.centerX, this.centerY);
    } else if (this.type === 'image') {
      this.ctx.drawImage(this.fileUrl, this.x, this.y, this.w, this.h);
    }
    // 如果是选中状态，绘制选择虚线框，和缩放图标、删除图标
    if (this.selected) {
      this.ctx.setLineWidth(2);
      //阴影
      if (this.type === 'text') {
        //this._roundRect(this.x - 5, this.y - 5, textWidth + 10, textHeight + 10,10);
        if (DEL_ENABLE)
          this.ctx.drawImage(DELETE_ICON, this.x - 15, this.y - 15, 30, 30);
        if (ZOOM_ENABLE)
          this.ctx.drawImage(DRAG_ICON, this.x + textWidth - 15, this.y + textHeight - 15, 30, 30);
        // 添加结点的按钮
        if (ADD_ENABLE)
          this.ctx.drawImage(ADD_ICON, this.x + textWidth - 15, this.y - 15, 30, 30);
      } else {
        this.ctx.strokeRect(this.x, this.y, this.w, this.h);
        if (DEL_ENABLE)
          this.ctx.drawImage(DELETE_ICON, this.x - 15, this.y - 15, 30, 30);
        if (ZOOM_ENABLE)
          this.ctx.drawImage(DRAG_ICON, this.x + this.w - 15, this.y + this.h - 15, 30, 30);
      }
    }
    this.ctx.restore();
  },
  /**
   * 
   * @param {CanvasContext} ctx canvas上下文
   * @param {number} x 圆角矩形选区的左上角 x坐标
   * @param {number} y 圆角矩形选区的左上角 y坐标
   * @param {number} w 圆角矩形选区的宽度
   * @param {number} h 圆角矩形选区的高度
   * @param {number} r 圆角的半径
   */
  _roundRect(x, y, w, h, r) {
    // 开始绘制
    let ctx = this.ctx;
    ctx.save();
    ctx.setShadow(0, 0, 10, this.isDeled ? DEL_COLOR : this.selected ? SELECT_COLOR : DEFAULT_COLOR);
    ctx.beginPath();
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle('white');
     //ctx.setStrokeStyle('black')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);

    // border-top
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.lineTo(x + w, y + r);
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);

    // border-right
    ctx.lineTo(x + w, y + h - r);
    ctx.lineTo(x + w - r, y + h);
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);

    // border-bottom
    ctx.lineTo(x + r, y + h);
    ctx.lineTo(x, y + h - r);
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);

    // border-left
    ctx.lineTo(x, y + r);
    ctx.lineTo(x + r, y);

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill();
    // ctx.stroke();
    ctx.closePath();
    // 剪切
    ctx.clip();
    ctx.restore();
  },
  /**
   * 给矩形描边
   * @private
   */
  _drawBorder() {
    let p = this.square;
    let ctx = this.ctx;
    this.ctx.save();
    this.ctx.beginPath();
    ctx.setStrokeStyle('orange');
    this._draw_line(this.ctx, p[0], p[1]);
    this._draw_line(this.ctx, p[1], p[2]);
    this._draw_line(this.ctx, p[2], p[3]);
    this._draw_line(this.ctx, p[3], p[0]);
    ctx.restore();
  },
  /**
   * 画一条线
   * @param ctx
   * @param a
   * @param b
   * @private
   */
  _draw_line(ctx, a, b) {
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  },
  /**
   * 判断点击的坐标落在哪个区域
   * @param {*} x 点击的坐标
   * @param {*} y 点击的坐标
   */
  isInGraph(x, y) {
    // 删除区域左上角的坐标和区域的高度宽度
    const delW = 30;
    const delH = 30;

    // 旋转后的删除区域坐标
    const transformedDelCenter = this._rotatePoint(this.x, this.y, this.centerX, this.centerY, this.rotate);
    const transformDelX = transformedDelCenter[0] - delW / 2;
    const transformDelY = transformedDelCenter[1] - delH / 2;

    // 变换区域左上角的坐标和区域的高度宽度
    const scaleW = 30;
    const scaleH = 30;
    const transformedScaleCenter = this._rotatePoint(this.x + this.w, this.y + this.h, this.centerX, this.centerY, this.rotate);

    // 旋转后的变换区域坐标
    const transformScaleX = transformedScaleCenter[0] - scaleW / 2;
    const transformScaleY = transformedScaleCenter[1] - scaleH / 2;

    // 添加结点区域的区域坐标,此处设置在右上角
    const addW = 30;
    const addH = 30;
    const transformedAddCenter = this._rotatePoint(this.x + this.w, this.y, this.centerX, this.centerY, this.rotate);
    const transformAddX = transformedAddCenter[0] - addW / 2;
    const transformAddY = transformedAddCenter[1] - addH / 2;

    // 调试使用，标识可操作区域
    if (DEBUG_MODE) {
      // 标识删除按钮区域
      this.ctx.setLineWidth(1);
      this.ctx.setStrokeStyle('red');
      this.ctx.strokeRect(transformDelX, transformDelY, delW, delH);
      // 标识旋转/缩放按钮区域
      this.ctx.setLineWidth(1);
      this.ctx.setStrokeStyle('black');
      this.ctx.strokeRect(transformScaleX, transformScaleY, scaleW, scaleH);
      // 标识添加结点区域
      this.ctx.setLineWidth(1);
      this.ctx.setStrokeStyle('black');
      this.ctx.strokeRect(transformAddX, transformAddY, addW, addH);
      // 标识移动区域
      this._drawBorder();
    }

    if (ZOOM_ENABLE && x - transformScaleX >= 0 && y - transformScaleY >= 0 &&
      transformScaleX + scaleW - x >= 0 && transformScaleY + scaleH - y >= 0) {
      // 缩放区域
      return 'transform';
    } else if (DEL_ENABLE && x - transformDelX >= 0 && y - transformDelY >= 0 &&
      transformDelX + delW - x >= 0 && transformDelY + delH - y >= 0) {
      // 删除区域
      return 'del';
    } else if (ADD_ENABLE && x - transformAddX >= 0 && y - transformAddY >= 0 &&
      transformAddX + addW - x >= 0 && transformAddY + addH - y >= 0) {
      return 'add';
    } else if (this.insidePolygon(this.square, [x, y])) {
      return 'move';
    }
    // 不在选择区域里面
    return false;
  },
  /**
   *  判断一个点是否在多边形内部
   *  @param points 多边形坐标集合
   *  @param testPoint 测试点坐标
   *  返回true为真，false为假
   *  */
  insidePolygon(points, testPoint) {
    let x = testPoint[0],
      y = testPoint[1];
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      let xi = points[i][0],
        yi = points[i][1];
      let xj = points[j][0],
        yj = points[j][1];

      let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  },
  /**
   * 计算旋转后矩形四个顶点的坐标（相对于画布）
   * @private
   */
  _rotateSquare() {
    this.square = [
      this._rotatePoint(this.x, this.y, this.centerX, this.centerY, this.rotate),
      this._rotatePoint(this.x + this.w, this.y, this.centerX, this.centerY, this.rotate),
      this._rotatePoint(this.x + this.w, this.y + this.h, this.centerX, this.centerY, this.rotate),
      this._rotatePoint(this.x, this.y + this.h, this.centerX, this.centerY, this.rotate),
    ];
  },
  /**
   * 计算旋转后的新坐标（相对于画布）
   * @param x
   * @param y
   * @param centerX
   * @param centerY
   * @param degrees
   * @returns {*[]}
   * @private
   */
  _rotatePoint(x, y, centerX, centerY, degrees) {
    let newX = (x - centerX) * Math.cos(degrees * Math.PI / 180) - (y - centerY) * Math.sin(degrees * Math.PI / 180) + centerX;
    let newY = (x - centerX) * Math.sin(degrees * Math.PI / 180) + (y - centerY) * Math.cos(degrees * Math.PI / 180) + centerY;
    return [newX, newY];
  },
  /**
   *
   * @param {*} px 手指按下去的坐标
   * @param {*} py 手指按下去的坐标
   * @param {*} x 手指移动到的坐标
   * @param {*} y 手指移动到的坐标
   * @param {*} currentGraph 当前图层的信息
   */
  transform(px, py, x, y, currentGraph) {
    // 获取选择区域的宽度高度
    if (this.type === 'text') {
      this.ctx.setFontSize(this.fontSize);
      const textWidth = this.ctx.measureText(this.text).width;
      const textHeight = this.fontSize + 10;
      this.w = textWidth;
      this.h = textHeight;
      // 字体区域中心点不变，左上角位移
      this.x = this.centerX - textWidth / 2;
      this.y = this.centerY - textHeight / 2;
    } else {
      this.centerX = this.x + this.w / 2;
      this.centerY = this.y + this.h / 2;
    }

    const diffXBefore = px - this.centerX;
    const diffYBefore = py - this.centerY;
    const diffXAfter = x - this.centerX;
    const diffYAfter = y - this.centerY;

    const angleBefore = Math.atan2(diffYBefore, diffXBefore) / Math.PI * 180;
    const angleAfter = Math.atan2(diffYAfter, diffXAfter) / Math.PI * 180;

    // 旋转的角度
    if (ROTATE_ENABLED) {
      this.rotate = currentGraph.rotate + angleAfter - angleBefore;
    }

    const lineA = Math.sqrt(Math.pow((this.centerX - px), 2) + Math.pow((this.centerY - py), 2));
    const lineB = Math.sqrt(Math.pow((this.centerX - x), 2) + Math.pow((this.centerY - y), 2));
    if (this.type === 'image') {
      let resize_rito = lineB / lineA;
      let new_w = currentGraph.w * resize_rito;
      let new_h = currentGraph.h * resize_rito;

      if (currentGraph.w < currentGraph.h && new_w < this.MIN_WIDTH) {
        new_w = this.MIN_WIDTH;
        new_h = this.MIN_WIDTH * currentGraph.h / currentGraph.w;
      } else if (currentGraph.h < currentGraph.w && new_h < this.MIN_WIDTH) {
        new_h = this.MIN_WIDTH;
        new_w = this.MIN_WIDTH * currentGraph.w / currentGraph.h;
      }

      this.w = new_w;
      this.h = new_h;
      this.x = currentGraph.x - (new_w - currentGraph.w) / 2;
      this.y = currentGraph.y - (new_h - currentGraph.h) / 2;

    } else if (this.type === 'text') {
      const fontSize = currentGraph.fontSize * ((lineB - lineA) / lineA + 1);
      this.fontSize = fontSize <= this.MIN_FONTSIZE ? this.MIN_FONTSIZE : fontSize;

      // 旋转位移后重新计算坐标
      this.ctx.setFontSize(this.fontSize);
      const textWidth = this.ctx.measureText(this.text).width;
      const textHeight = this.fontSize + 10;
      this.w = textWidth;
      this.h = textHeight;
      // 字体区域中心点不变，左上角位移
      this.x = this.centerX - textWidth / 2;
      this.y = this.centerY - textHeight / 2;
    }
  },
  toPx(rpx) {
    return rpx * this.factor;
  },
};

// 增加了绘制线条的类
const edgeGraph = function({
  width = 2,
  color = 'gray'
}, canvas, fromGraph, toGraph) {
  this.ctx = canvas;
  this.fromGraph = fromGraph;
  this.toGraph = toGraph;
  this.width = width;
  this.color = color;
};

edgeGraph.prototype = {
  paint() {
    // this.ctx.save();
    // 根据graph相对位置从不同端点绘制线条
    this.ctx.setLineWidth(this.width);
    this.ctx.setStrokeStyle(this.color);
    if (this.fromGraph && this.toGraph) {
      let fromX = this.fromGraph.centerX;
      let fromY = this.fromGraph.centerY;
      let toX = this.toGraph.centerX;
      let toY = this.toGraph.centerY;
      let UpperGraph, LowerGraph, LefterGraph, RighterGraph;
      if (fromY < toY) {
        UpperGraph = this.fromGraph;
        LowerGraph = this.toGraph;
      } else {
        UpperGraph = this.toGraph;
        LowerGraph = this.fromGraph;
      }
      if (fromX < toX) {
        LefterGraph = this.fromGraph;
        RighterGraph = this.toGraph;
      } else {
        LefterGraph = this.toGraph;
        RighterGraph = this.fromGraph;
      }
      let delX = Math.abs(fromX - toX);
      let delY = Math.abs(fromY - toY);
      //x差值更大时以左右坐标为端点
      // if (delX > delY) {
      //   fromX = LefterGraph.centerX + LefterGraph.w / 2;
      //   toX = RighterGraph.centerX - RighterGraph.w / 2;

      //   fromY = LefterGraph.centerY;
      //   toY = RighterGraph.centerY;
      // } else {
      //   //y差值更大以上下为端点
      //   fromY = UpperGraph.centerY + UpperGraph.h / 2;
      //   fromX = UpperGraph.centerX;
      //   toY = LowerGraph.centerY - LowerGraph.h / 2;
      //   toX = LowerGraph.centerX;
      // }
      this.ctx.moveTo(fromX, fromY);
      this.ctx.lineTo(toX, toY);
      this.ctx.stroke();
      this.ctx.restore();
    } else {
      return;
    }
  },
  /**
   * 画一条线
   * @param ctx
   * @param a
   * @param b
   * @private
   */
  _draw_line(ctx, a, b) {
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  }
};

Component({
  /**
   * 组件的属性列表
   */
  properties: {

    graph: {
      type: Object,
      value: {},
      observer: 'onGraphChange',
    },
    bgColor: {
      type: String,
      value: '',
    },
    bgImage: {
      type: String,
      value: '',
    },
    bgSourceId: {
      type: String,
      value: '',
    },
    width: {
      type: Number,
      value: 750,
    },
    height: {
      type: Number,
      value: 750,
    },

  },

  /**
   * 组件的初始数据
   */
  data: {},

  attached() {
    const sysInfo = wx.getSystemInfoSync();
    const screenWidth = sysInfo.screenWidth;
    this.factor = screenWidth / 750;
    
    //initX = this.toPx(screenWidth/2);
    //不知道为啥获取不到屏幕正中的绘图位置，就先这样吧
    initX = 155;
    console.log(screenWidth+','+initX);
    if (typeof this.drawArr === 'undefined') {
      this.drawArr = [];
    }

    if (typeof this.edgeArr === 'undefined') {
      this.edgeArr = [];
    }

    if (typeof this.treeRawArr == 'undefined') {
      this.treeRawArr = [];
    }

    this.ctx = wx.createCanvasContext('canvas-label', this);
    this.draw();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPx(rpx) {
      return rpx * this.factor;
    },
    onGraphChange(n, o) {
      if (JSON.stringify(n) === '{}') return;
      this.drawArr.push(new dragGraph(Object.assign({
        x: 30,
        y: 30,
      }, n), this.ctx, this.factor));
      this.draw();
    },
    // 设置画布的元素内容
    initByArr(newArr) {
      this.drawArr = [];
      this.edgeArr = [];
      // 循环插入 drawArr
      newArr.forEach((item, index) => {
        switch (item.type) {
          case 'bgColor':
            this.data.bgImage = '';
            this.data.bgSourceId = '';
            this.data.bgColor = item.color;
            break;
          case 'bgImage':
            this.data.bgColor = '';
            this.data.bgImage = item.url;
            if (item.sourceId) {
              this.data.bgSourceId = item.sourceId;
            }
            break;
          case 'image':
          case 'text':
            if (index === newArr.length - 1) {
              item.selected = true;
            } else {
              item.selected = false;
            }
            this.drawArr.push(new dragGraph(item, this.ctx, this.factor));
            break;
        }

      });
      this.draw();
    },
    getSelectedNode() {
      if (this.tempGraphArr.length == 0) {
        return {};
      } else {
        return this.tempGraphArr[0];
      }
    },
    // 画布的绘制
    draw() {
      if (this.data.bgImage !== '') {
        this.ctx.drawImage(this.data.bgImage, 0, 0, this.toPx(this.data.width), this.toPx(this.data.height));
      }
      if (this.data.bgColor !== '') {
        this.ctx.save();
        this.ctx.setFillStyle(this.data.bgColor);
        this.ctx.fillRect(0, 0, this.toPx(this.data.width), this.toPx(this.data.height));
        this.ctx.restore();
      }
      // 绘制edge
      this.edgeArr.forEach((item) => {
        item.paint();
      });

      // 绘制graph
      this.drawArr.forEach((item) => {
        item.paint();
      });
      
      return new Promise((resolve) => {
        this.ctx.draw(false, () => {
          resolve();
        });
      });
    },
    start(e) {
      const {
        x,
        y
      } = e.touches[0];
      this.tempGraphArr = [];
      let lastDelIndex = null; // 记录最后一个需要删除的索引
      this.drawArr && this.drawArr.forEach((item, index) => {
        const action = item.isInGraph(x, y);
        if (action) {
          item.action = action;
          this.tempGraphArr.push(item);
          // 保存点击时的坐标
          this.currentTouch = {
            x,
            y
          };
          if (action === 'del') {
            lastDelIndex = index; // 标记需要删除的元素
          }
        } else {
          item.action = false;
          item.selected = false;
          //记录选中的结点在treeArr中的下标
        }
      });
      // 保存点击时元素的信息
      if (this.tempGraphArr.length > 0) {
        for (let i = 0; i < this.tempGraphArr.length; i++) {
          let lastIndex = this.tempGraphArr.length - 1;
          // 对最后一个元素做操作
          if (i === lastIndex) {
            // 未选中的元素，不执行删除和缩放操作
            if (lastDelIndex !== null && this.tempGraphArr[i].selected) {
              if (this.drawArr[lastDelIndex].action === 'del') {
                // 删除drawGraph和相关的edge
                // TODO：这里只是删掉了相关的edge和node，没有递归删除子节点，可以根据需求日后修改
                for (var i = 0; i < this.edgeArr.length; i++) {
                  if (this.edgeArr[i].fromGraph === this.drawArr[lastDelIndex] ||
                    this.edgeArr[i].toGraph === this.drawArr[lastDelIndex]) {
                    this.edgeArr.splice(i--, 1);
                  }
                }
                this.drawArr.splice(lastDelIndex, 1);
                this.ctx.clearRect(0, 0, this.toPx(this.data.width), this.toPx(this.data.height));
              }
            } else if (this.tempGraphArr[lastIndex].action === 'add') {
              this.addNew(this.tempGraphArr[lastIndex]);
            } else {
              this.tempGraphArr[lastIndex].selected = true;
              this.currentGraph = Object.assign({}, this.tempGraphArr[lastIndex]);
            }
          } else {
            // 不是最后一个元素，不需要选中，也不记录状态
            this.tempGraphArr[i].action = false;
            this.tempGraphArr[i].selected = false;
          }
        }
      }
      //传值
      this.triggerEvent('onSelectedChange', JSON.stringify(this.getSelectedNode().taskattrs == undefined ? {} : this.getSelectedNode().taskattrs));
      this.draw();
    },
    move(e) {
      const {
        x,
        y
      } = e.touches[0];
      if (this.tempGraphArr && this.tempGraphArr.length > 0) {
        const currentGraph = this.tempGraphArr[this.tempGraphArr.length - 1];
        if (currentGraph.action === 'move') {
          currentGraph.centerX = this.currentGraph.centerX + (x - this.currentTouch.x);
          currentGraph.centerY = this.currentGraph.centerY + (y - this.currentTouch.y);
          // 使用中心点坐标计算位移，不使用 x,y 坐标，因为会受旋转影响。
          if (currentGraph.type !== 'text') {
            currentGraph.x = currentGraph.centerX - this.currentGraph.w / 2;
            currentGraph.y = currentGraph.centerY - this.currentGraph.h / 2;
          }
        } else if (currentGraph.action === 'transform') {
          currentGraph.transform(this.currentTouch.x, this.currentTouch.y, x, y, this.currentGraph);
        }
        // 更新4个坐标点（相对于画布的坐标系）
        currentGraph._rotateSquare();
        this.draw();
      }

    },
    end(e) {
      //this.tempGraphArr = [];
    },
    export () {
      return new Promise((resolve, reject) => {
        this.drawArr = this.drawArr.map((item) => {
          item.selected = false;
          return item;
        });
        this.draw().then(() => {
          wx.canvasToTempFilePath({
            canvasId: 'canvas-label',
            success: (res) => {
              resolve(res.tempFilePath);
            },
            fail: (e) => {
              reject(e);
            },
          }, this);
        });
      })
    },
    exportJson() {
      return new Promise((resolve, reject) => {
        let exportArr = this.drawArr.map((item) => {
          item.selected = false;
          switch (item.type) {
            case 'image':
              return {
                type: 'image',
                url: item.fileUrl,
                y: item.y,
                x: item.x,
                w: item.w,
                h: item.h,
                rotate: item.rotate,
                sourceId: item.sourceId,
              };
              break;
            case 'text':
              return {
                type: 'text',
                text: item.text,
                color: item.color,
                fontSize: item.fontSize,
                y: item.y,
                x: item.x,
                w: item.w,
                h: item.h,
                rotate: item.rotate,
              };
              break;
          }
        });
        if (this.data.bgImage) {
          let tmp_img_config = {
            type: 'bgImage',
            url: this.data.bgImage,
          };
          if (this.data.bgSourceId) {
            tmp_img_config['sourceId'] = this.data.bgSourceId;
          }
          exportArr.unshift(tmp_img_config);
        } else if (this.data.bgColor) {
          exportArr.unshift({
            type: 'bgColor',
            color: this.data.bgColor
          });
        }

        resolve(exportArr);
      })
    },
    //这是一些测试本地绘图的东西
    addNewNode(newNodeAttr = {
      Task: {
        TaskID: "tt",
        Title: "新任务",
        Pusher: "tt",
        Content: "这是一个新任务",
        Status: false,
        PushDate: "tt",
        DeadLine: "tt",
        Urgency: 3
      },
      Self: this.treeRawArr.length,
      Child: [0],
      TeamMates: ["tt"]
    }) {
      var x_offset = 20,
        y_offset = 20;
      //↓↓把这部分换成访问服务器就可以了
      var fromNode = this.tempGraphArr[0];
      var index = fromNode.taskattrs[SELF];
      this.treeRawArr.push(newNodeAttr);
      if (this.treeRawArr[index][CHILD][0] == 0) {
        this.treeRawArr[index][CHILD] = [];
      }
      this.treeRawArr[index][CHILD].push(this.treeRawArr.length - 1);
      //直接push一个新的dragGraph对象
      var newTaskGraph = new dragGraph({
        x: fromNode.x + x_offset,
        y: fromNode.y + y_offset,
        text: newNodeAttr[TASK][TITLE],
        type: "text"
      }, this.ctx, this.factor, newNodeAttr);
      var newedge = new edgeGraph({
        width: 2,
        color: 'gray'
      }, this.ctx, fromNode, newTaskGraph);
      this.drawArr.push(newTaskGraph);
      this.edgeArr.push(newedge);
      fromNode.selected = false;
      this.tempGraphArr[0]=newTaskGraph;
      this.triggerEvent('onSelectedChange', JSON.stringify(this.getSelectedNode().taskattrs == undefined ? {} : this.getSelectedNode().taskattrs));
      this.draw();
      // this.clearCanvas();
      // this.setByTree();
      //↑↑把这部分换成访问服务器就可以了

      //即时显示新增结点的话就先不调用page里的onRefresh了
      //onRefresh我想的是一些访问服务器的刷新操作
      //可以改成按钮之类的
      //this.triggerEvent('onRefresh');
    },
    //将结点标记为删除或标记为删除的结点的恢复
    delNode() {
      var selectedTaskInfo = this.tempGraphArr[0].taskattrs;
      this.tempGraphArr[0].isDeled = !this.tempGraphArr[0].isDeled;
      /*访问服务器删除的操作*/
      /*访问服务器删除的操作*/
      /*访问服务器删除的操作*/
      //this.triggerEvent('onRefresh');
      this.draw();
    },
    // 包括"Tree":{} "self":n "child":[a,b,c]
    // 传值传的都是dragGraph对象 包含task atrr json
    _insertTreeNode(fromTaskGraph) {
      this.drawArr.push(fromTaskGraph)
      var d = 80;
      var pos_x_offset = 0;
      var pos_y_offset = 80;
      var childs = fromTaskGraph.taskattrs[CHILD];
      pos_x_offset = -(childs.length - 1) * d / 2;
      //非叶子节点
      if (childs[0] != 0) {
        for (var i = 0; i < childs.length; i++) {
          var index = childs[i];
          var nextTaskNodeAtrr = this.treeRawArr[index];
          var newTaskGraph = new dragGraph({
            x: fromTaskGraph.x + pos_x_offset,
            y: fromTaskGraph.y + pos_y_offset,
            text: nextTaskNodeAtrr[TASK][TITLE],
            type: "text"
          }, this.ctx, this.factor, nextTaskNodeAtrr);
          var newedge = new edgeGraph({
            width: 2,
            color:'gray'
          }, this.ctx, fromTaskGraph, newTaskGraph);
          this.edgeArr.push(newedge);
          this._insertTreeNode(newTaskGraph);
          pos_x_offset += 80;
        }
      }
    },
    // 传入亮佬格式的json
    initByTreeArr(treeArr) {
      // self遍历一遍散列进treeRawArr
      for (var i = 0; i < treeArr.length; i++) {
        // 这是个dict
        var thisTask = treeArr[i];
        // 这是个int
        var arrIndex = thisTask[SELF];
        this.treeRawArr[arrIndex] = thisTask;
      }

      var rootTaskNode = this.treeRawArr[0];
      var newgraph = new dragGraph({
        x: initX,
        y: initY,
        text: rootTaskNode[TASK][TITLE],
        type: "text"
      }, this.ctx, this.factor, rootTaskNode);
      this._insertTreeNode(newgraph);
      this.draw();
    },
    //执行删除所有标记为isDeled的结点
    //这里的删除是仅删除父节点的childs
    onDoDel() {
      for (var i = 0; i < this.drawArr.length; i++) {
        if (this.drawArr[i].isDeled) {
          var index = this.drawArr[i].taskattrs[SELF];
          for (var j = 0; j < this.treeRawArr.length; j++) {
            var theindex = -1;
            //小程序没有indexOf???
            for (var k = 0; k < this.treeRawArr[j][CHILD].length; k++) {
              if (this.treeRawArr[j][CHILD][k] == index) {
                theindex = k;
                break;
              }
            }
            if (theindex > -1) {
              //修改CHILD
              this.treeRawArr[j][CHILD].splice(theindex, 1);
              break;
            }
          }
        }
      }
      this.triggerEvent("onRefresh");
    },
    // 更改结点即数组的信息
    changeNodeInfo(newInfo, targetNode = this.tempGraphArr[0]) {
      //console.log(newInfo.Title);
      targetNode.taskattrs[TASK][TITLE] = newInfo.Title;
      targetNode.taskattrs[TASK][CONTENT] = newInfo.Content;
      targetNode.taskattrs[TASK][DEADLINE] = newInfo.DeadLine;
      this.draw();
    },
    setByTree() {
      const initX = 100,
        initY = 100;
      var rootTaskNode = this.treeRawArr[0];
      var newgraph = new dragGraph({
        x: initX,
        y: initY,
        text: rootTaskNode[TASK][TITLE],
        type: "text"
      }, this.ctx, this.factor, rootTaskNode);
      this._insertTreeNode(newgraph);
      this.draw();
    },

    //@param self int
    getTaskByIndex(self) {
      for (var i = 0; i < this.treeRawArr.length; i++) {
        var thistask = treeRawArr[i];
        if (self == thistask[SELF])
          return thistask;
      }
      return undefined;
    },
    enableZoom(trueOrfalse) {
      ZOOM_ENABLE = trueOrfalse;
    },
    enableDel(trueOrfalse) {
      DEL_ENABLE = trueOrfalse;
    },
    enableAdd(trueOrfalse) {
      ADD_ENABLE = trueOrfalse;
    },
    changColor(color) {
      const selected = this.drawArr.filter((item) => item.selected);
      if (selected.length > 0) {
        selected[0].color = color;
      }
      this.draw();
    },
    changeBgColor(color) {
      this.data.bgImage = '';
      this.data.bgColor = color;
      this.draw();
    },
    changeBgImage(newBgImg) {
      this.data.bgColor = '';
      if (typeof newBgImg == 'string') {
        this.data.bgSourceId = '';
        this.data.bgImage = newBgImg;
      } else {
        this.data.bgSourceId = newBgImg.sourceId;
        this.data.bgImage = newBgImg.url;
      }
      this.draw();
    },
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.toPx(this.data.width), this.toPx(this.data.height));
      this.ctx.draw();
      this.drawArr = [];
      this.edgeArr = [];
      this.data.bgColor = '';
      this.data.bgSourceId = '';
      this.data.bgImage = '';
    }
  }
});