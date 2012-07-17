var OhlcPanel = function(){
    this.initialize();
};

OhlcPanel.prototype = {
    initialize : function(){
	this.container = $("#minipanel .ohlcpanel");
	this.tradePrice = this.container.find(".tradePrice");
	this.openPrice = this.container.find(".openPrice");
	this.highPrice = this.container.find(".highPrice");
	this.lowPrice = this.container.find(".lowPrice");
	this.closePrice = this.container.find(".closePrice");
	this.volume = this.container.find(".volume");
    },

    update : function(){
	this.tradePrice.html(this.getValue());
	this.openPrice.html(this.getValue());
	this.highPrice.html(this.getValue());
	this.lowPrice.html(this.getValue());
	this.closePrice.html(this.getValue());
	this.volume.html(this.getValue());
    },

    getValue : function(){
	return Math.floor(Math.random() * 100);
    }
    
};

var MiniChart = function(){
    this.initialize();
};

MiniChart.prototype = {

    initialize : function(){
	this.target = $("#minipanel .minichart .line");
    },

    update : function(top){
	var position = this.target.position();
	var newleft = 260 - (top / 10);
	this.target.css({
	    left : newleft
	});
    }

};



var MiniPanel = function(){
    this.initialize();
};

MiniPanel.prototype = {
    
    initialize: function(){
	var self = this;
	$(window).scroll(function(){
	    self.onScroll();
	});
	this.target = $("#minipanel");
	this.ohlcPanel = new OhlcPanel();
	this.miniChart = new MiniChart();
    },

    start : function(){

    },

    onScroll : function(){
	var top = $(window).scrollTop();
	this.target.fadeIn('fast');
	this.move(top);
	this.update(top);
    },

    move : function(y){
	console.log(y);

	this.target.css({
	    top: y + 60 + "px"
	});
    },

    update : function(top){
	this.ohlcPanel.update(top);
	this.miniChart.update(top);
    }
   
};

