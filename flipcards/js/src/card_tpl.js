/**
 * 模版模块
 * Date: 2014-02-13
 */
define(function(require, exports, module){
  exports.cardTpl = '<li>'+
                      '<div class="container">'+
                        '<div class="card" id="card {0}" onclick="Game.flipCard(this)">'+
                          '<div class="front"><img alt="front" src="img/texture.jpg"></div>'+
                          '<div class="back"><img alt="back" src="img/c{1}.gif"></div>'+
                        '</div>'+
                      '</div>'+
                    '</li>';
                    
});