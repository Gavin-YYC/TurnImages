/*
 * Turn.js
 * @author by: Gavin
 * QQ: 954150410
 */


function Turn( elem, opts ) {
  var options = {
    delay: {                      // 每一个图片的延迟基础
      v: 150,                     // 纵向的延迟基数
      h: 200                      // 横向的延迟基数
    },
    column: [3,4],                // 页面布局，三行四列
    duration: 800,                // 动画时间
    timingFunction: 'ease-out',   // 动画函数
    imgItem: 'img-item',          // 生成的图片容器类
    autoplay: true,               // 是否自动播放
    timeout: 10000                // 每隔多少时间自动翻转
  };
  this.timer = null;
  this.currentTurn = 0;
  this.imageContainer = $(elem);
  this.images = this.imageContainer.find('img');
  this.options = $.extend( options, opts );
  this._setupImages();
  this._setTransitionProperty();

  if ( this.options.autoplay ) {
    this._autoplay();
  }
}


Turn.prototype = {
  constructor: Turn,

  _setupImages: function () {
    var that = this;
    var html = '';
    that.images.each(function ( index, img ) {
      var $img = $( img );
      var originPic = $img.prop('src');
      var backPic = $img.prop('alt');

      var image_origin = new Image();
      var image_back = new Image();
      image_origin.src = originPic;
      image_back.src = backPic;
      image_origin.onload = function ( e ) {
        that._handlBackgroundSize( index, image_origin.width, image_origin.height, true );
      }
      image_back.onload = function () {
        that._handlBackgroundSize( index, image_back.width, image_back.height, false );
      }
      html += '<div class="' + that.options.imgItem + '"><div class="img img-origin" style="background-image: url(' + originPic + ')"></div>' +
      '<div class="img img-back" style="background-image: url(' + backPic + ')"></div></div>';
      $img.remove();
    });
    that.imageContainer.append( html );
    that.imgItem = that.imageContainer.find( '.' + that.options.imgItem );
    that._setImagesLayout();
  },


  // 处理背景图片大小拉伸
  _handlBackgroundSize: function ( index, width, height, isOrigin ) {
    var ele;
    $ele = $( this.imgItem[ index ][ isOrigin ? 'firstChild' : 'lastChild' ] );
    $ele.addClass( width >= height ? 'img-width-big' : 'img-width-small' );
  },


  _setImagesLayout: function () {
    var column = this.options.column;
    var column_row = column[0];     // 行数
    var column_column = column[1];  // 列数
    var perWidth = 100.0 / column_column;
    var perHeight = 100.0 / column_row;
    this.imgItem.css({
      width: perWidth + '%',
      height: perHeight + 'vh'
    });
  },


  _setTransitionProperty: function () {
    var that = this;
    that.imgItem.each(function ( index, elem ) {
      that._setImageTransitionProp( index, elem );
    });
  },


  _setImageTransitionProp: function( index, elem  ) {
    var duration  = parseInt( this.options.duration ),
        timingFunction = this.options.timingFunction,
        delay = this._getDelayTime( index );
    $( elem ).css({
      transition: 'transform ' + duration + 'ms ' + timingFunction + ' ' + delay + 'ms'
    });
  },


  // 给定一个值，计算延迟时间
  // 为实现层叠效果，时间延迟规则为：
  // 纵向延迟：150
  // 横向延迟：200
  _getDelayTime: function ( index ) {
    var true_index = index + 1;
    var column = this.options.column[1];
    var value, pos_x, pos_y, delay;

    value = true_index % column;
    pos_x = Math.ceil( true_index / column );
    pos_y = value == 0 ? column : value;
    delay = ( pos_y - 1 ) * this.options.delay.h + ( pos_x - 1 ) * this.options.delay.v;
    return delay;
  },


  next: function () {
    this.currentTurn += 0.5;
    this.imgItem.css('transform', 'rotateY(' + this.currentTurn + 'turn)');
  },


  _autoplay: function () {
    var that = this;
    var lastTime = new Date()
    var handle = function () {
      var nowTime = new Date();
      if ( nowTime - lastTime >= that.options.timeout ) {
        that.next();
        lastTime = nowTime;
      }
      window.requestAnimationFrame( handle );
    }
    window.requestAnimationFrame( handle );
  }
}
