var util = util || {};
util.extend = function(destination, source, override) {
    
    function copy(dest, origin){
        for (var property in origin) {
            dest.prototype[property] = origin[property];
        }
    }
    copy(destination, source.prototype);
    copy(destination, override);
  
    return destination;
};

var LikeSplash  = function(){
    this.initialize();
};

LikeSplash.prototype = {
    
    likeString : "いいね!",
    
    classValue : "likeSplash",
    
    animeOption : {
        fontSize : "100px",
        duration : 1000
    },
    
    initialize : function(){
        this.element = $('<div class="' + this.classValue + '">' + this.likeString + '</div>');
        $(document.body).append(this.element);
    }, 
    
    move : function(){
        var point = this.calcShowPoint();
        this.element.css({
            left : point.x,
            top : point.y
        });
    },
    
    calcShowPoint : function(){
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var x = Math.floor(Math.random() * windowWidth) - 100;
        var y = Math.floor(Math.random() * windowHeight) - 200;
        if(x < 0) x = 0;
        if(y < 0) y = 0;
        return {x : x, y : y};
    },
    
    show : function(){
        var self = this;
        this.move();
        this.element.animate({
            scale3d: '2,2,2',
            opacity: 0.1
        }, 
        self.animeOption.duration,
         function(){
            self.element.fadeOut(500);
            self.element.remove();
        });
    }
    
};

var BigLikeSplash  = function(count){
    this.likeString = count;
    this.initialize();
};

util.extend(BigLikeSplash, LikeSplash, {

    classValue : "big likeSplash",
    
    animeOption : {
        fontSize : "200px",
        duration : 2000
    },

    calcShowPoint : function(){
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        
        var x = windowWidth / 2 - 300;
        var y = windowHeight / 2 - 300;

        return {x : x, y : y};
    }
    
});

var StampSplash = function(stampId){
    this.likeString = '<img src="/img/' + stampId + '.png" />';
    this.initialize(stampId);
}
util.extend(StampSplash, LikeSplash, {

    initialize : function(){
        this.element = $('<div class="' + this.classValue + '">' + this.likeString + '</div>');
        $(document.body).append(this.element);
    }
    
});

var Stamp = function(args){
    this.initialize(args);
};

Stamp.prototype = {

    status : true,

    initialize : function(args){
	this.socket = args.socket;
	this.ele = args.ele;
        this.setupListener();
    },

    setupListener : function(){
	var self = this;
        this.ele.click(function(){
	    self.click();
            return false;
	});
    },

    click : function(){
        if(! this.status) return;
        this.status = false;
        
        var self = this;
        this.ele.css({ "opacity": "0.5"});
	var ack = function(){
            self.status = true;
            self.ele.css({"opacity": "1.0"}); 
            if(self.timer !== null) clearTimeout(self.timer);
        };
        this.timer = setTimeout(ack, 5000);
        this.socket.emit(
	    "heart", 
	    {stampId: this.ele.attr("id")}, 
	    ack
	);
    }
};



var LikePanel = function(args){
    this.initialize(args);
};
LikePanel.prototype = {
    
    timer : null,
   
    stamps : {},
    
    initialize : function(args){
        this.socket = args.socket;
        this.stamps = $(args.selector.button);
        this.likeCount = $(args.selector.counter);   
        this.setupListener();
    },
    
    setupListener : function(){
        var self = this;
        new Stamp({
           socket : self.socket,
	   ele : self.stamps
	});
        this.socket.on("push-heart", function(data){
	    console.log("receive push-heart");
            self.onLikeCountUp(data);
            self.initialReceive = true;
        });
    },

    onLikeCountUp : function(data){
        this.likeCount.html(data.count);
        if(data.initial) return;
        if(data.kiriban){
            new BigLikeSplash(data.count).show();
        }else{
            new StampSplash(data.stampId).show();
        }
        this.likeButtonDisable = false;
    }

};


var StampChanger = function(args){
    this.initialize(args);
};
StampChanger.prototype = {

    default : "likeCarousel",
    
    stamps : {},
    
    initialize : function(args){
        this.socket = args.socket;
        this.stamps = args.stamps;
	for(var i in this.stamps){
	    $(this.stamps[i].stamp).swipeSlide();
	}
        this.setupListener();
	this.initialShow();
    },

    initialShow: function(){
	for(var i in this.stamps){
	    $(this.stamps[i].stamp).css({ bottom: "10000px"});
	}
        $(this.stamps[this.default].stamp).css({bottom: "20px"});
    },
    
    setupListener : function(){
        var self = this;
        this.socket.on("likeSession-stampChange", function(data){
            self.onChange(data);
        });
    },

    onChange : function(data){
	for(var i in this.stamps){
	    $(this.stamps[i].stamp).css({ bottom: "10000px"});
	}
        $(this.stamps[data].stamp).css({bottom: "20px"});
    }

};
