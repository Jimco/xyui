/**
 * 翻牌子
 * Date: 2014-02-13
 */
define(function(require, exports, module){
  var board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    , uncovered = 0
    , ready = true
    , listener = null
    , lastCard = [];

  function template(str, data){
    var fn = new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    
    return data ? fn( data ) : fn;
  }

  function cardTpl(tpl, cardName){
    var template = tpl.format(cardName, cardName);
    return template;
  }

  function shuffleArr(arr){
    for(var i = arr.length - 1; i > 0; i--){
      var j = Math.floor( Math.random() * (i + 1) )
        , temp = arr[i];

      arr[i] = arr[j];
      arr[j] = temp;
    }

    return arr;
  }

  function makeCards(tpl, context){
    board = shuffleArr(board);
    for(var i = 0, l = board.length; i < l; i++){
      context.innerHTML += cardTpl(tpl, board[i]);
    }
  }

  function Game(){
    var context = document.getElementById('cardsSet')
      , tpl = require('./card_tpl');

    makeCards(tpl.cardTpl, context);
  }

  Game.NUM_OF_CARDS = 20;

  function setFixed(card){
    card.className = 'fixed';
    card.removeChild(card.childNodes[0]);
    card.onclick = null;
  }

  function checkRuls(card){
    if(lastCard.id === card.id){
      setFixed(card);
      setFixed(lastCard);
    }
    else{
      card.classList.toggle('flipped');
      lastCard.classList.toggle('flipped');
    }

    card.removeEventListener('transitionend', listener, false);
    uncovered = 0;
    ready = true;
  }

  Game.flipCard = function(card){
    if(lastCard !== card && uncovered < 2 && ready){
      card.classList.toggle('flipped');
      uncovered++;
      if(uncovered === 2){
        ready = false;
        listener = function(){ checkRuls(card); };
        card.addEventListener('transitionend', listener, false);
      }
      else{
        lastCard = card;
      }
    }
  }

  String.prototype.format = function(){
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, num){
      return typeof args[num] !== 'undefined' ? args[num] : match;
    });
  }

  module.exports = Game;

});