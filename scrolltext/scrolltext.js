/**
 * 文字上下滚动插件
 * Author:xjiancong@gmail.com
 * Date: 2013-08-27
 */
(function(window, document, undefined){

  var arrProto = Array.prototype
    , objProto = Object.prototype;

  function $(id){
    return document.getElementById(id);
  };

  // 迭代处理器
  function each(obj, iterator, context){
    if(obj == null) return;
    var nativeForeach = arrProto.forEach
      , breaker = {}
      , has = function(obj, key){
        return objProto.hasOwnProperty.call(obj, key);
      };

    if(nativeForeach && obj.forEach === nativeForeach){
      obj.forEach(iterator, context);
    }
    else if(obj.length === +obj.length){
      for(var i = 0, l = obj.length; i < l; i++){
        if( i in obj && iterator.call(context, obj[i], i, obj) === breaker ) return;
      }
    }
    else{
      for(key in obj){
        if( iterator.call(context, obj[key], key, obj) === breaker ) return;
      }
    }
  };

  // 将一个或多个对象的属性(包括原型链中的属性), 复制到obj对象，吐过存在同名属性则覆盖
  function extend(obj){
    var slice = arrProto.slice;
    each(slice.call(arguments, 1), function(source){
      for(var prop in source){
        obj[prop] = source[prop];
      }
    });

    return obj;
  };

  function ScrollText(options){

    var defaultSettings = {
        delay: 10,
        lineHeight: 20,
        amount: 1,
        direction: 'up',
        timeout: 1500
      };

    this.options = extend(defaultSettings, options);
    this.scrollContent = $(this.options.elemId);
    this.scrollContent.innerHTML += this.scrollContent.innerHTML;

    if (this.options.btnNext) {
      this.nextButton = $(this.options.btnNext);
      this.nextButton.onclick = this.getFunction(this, "next");
      this.nextButton.onmouseover = this.getFunction(this, "stop");
      this.nextButton.onmouseout = this.getFunction(this, "start");
    }
    if (this.options.btnPrevious) {
      this.previousButton = $(this.options.btnPrevious);
      this.previousButton.onclick = this.getFunction(this, "previous");
      this.previousButton.onmouseover = this.getFunction(this, "stop");
      this.previousButton.onmouseout = this.getFunction(this, "start");
    }

    this.scrollContent.onmouseover = this.getFunction(this, "stop");
    this.scrollContent.onmouseout = this.getFunction(this, "start");

    if (this.options.autoStart) {
      this.start();
    }
  }

  ScrollText.prototype.previous = function() {
    clearTimeout(this.autoScrollTimer);
    clearTimeout(this.scrollTimer);
    this.scroll("up");
  }

  ScrollText.prototype.next = function() {
    clearTimeout(this.autoScrollTimer);
    clearTimeout(this.scrollTimer);
    this.scroll("down");
  }

  ScrollText.prototype.start = function() {
    clearTimeout(this.autoScrollTimer);
    this.autoScrollTimer = setTimeout(this.getFunction(this, "autoScroll"), this.options.timeout);
  }

  ScrollText.prototype.stop = function() {
    clearTimeout(this.scrollTimer);
    clearTimeout(this.autoScrollTimer);
  }

  ScrollText.prototype.autoScroll = function() {
    if (this.options.direction == "up") {
      if (parseInt(this.scrollContent.scrollTop) >= parseInt(this.scrollContent.scrollHeight) / 2) {
        this.scrollContent.scrollTop = 0;
      }
      this.scrollContent.scrollTop += this.options.amount;
    } else {
      if (parseInt(this.scrollContent.scrollTop) <= 0) {
        this.scrollContent.scrollTop = parseInt(this.scrollContent.scrollHeight) / 2;
      }
      this.scrollContent.scrollTop -= this.options.amount;
    }
    if (parseInt(this.scrollContent.scrollTop) % this.options.lineHeight != 0) {
      this.scrollTimer = setTimeout(this.getFunction(this, "autoScroll"), this.options.delay);
    } else {
      this.autoScrollTimer = setTimeout(this.getFunction(this, "autoScroll"), this.options.timeout);
    }
  }

  ScrollText.prototype.scroll = function(direction) {
    if (direction == "up") {
      if (this.scrollContent.scrollTop == 0) {
        this.scrollContent.scrollTop = parseInt(this.scrollContent.scrollHeight) / 2;
      }
      this.scrollContent.scrollTop -= this.options.amount;
    } else {
      this.scrollContent.scrollTop += this.options.amount;
    }
    if (parseInt(this.scrollContent.scrollTop) >= parseInt(this.scrollContent.scrollHeight) / 2) {
      this.scrollContent.scrollTop = 0;
    }
    if (parseInt(this.scrollContent.scrollTop) % this.options.lineHeight != 0) {
      this.scrollTimer = setTimeout(this.getFunction(this, "scroll", direction), this.options.delay);
    }
  }

  ScrollText.prototype.getFunction = function(variable, method, param) {
    return function() {
      variable[method](param);
    }
  }

  window.ScrollText = ScrollText;

})(window, document);
  