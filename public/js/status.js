var ConnectionStatus = function(args){
    this.initialize(args);  
};

ConnectionStatus.prototype = {
    
    initialize : function(args){
        this.socket = args.socket;
        this.status = $(args.selector.status);
        this.count = $(args.selector.count);
        this.transport = $(args.selector.transport);
        this.start();
    },
    
    start : function(){        
        var self = this;
        this.socket.on('connecting', function(){
            self.status.html('connecting');
        });
        
        this.socket.on('connect', function(){
            self.status.html('connect');
        });

        this.socket.on('connect_faild', function(){
            self.status.html('connect_faild');
        });

        this.socket.on('reconnecting', function(){
            self.status.html('reconnecting');
        });
        
        this.socket.on('reconnect_faild', function(){
            self.status.html('reconnect_faild');
        });

        this.socket.on('disconnect', function(){
            self.status.html('disconnect');
        });
                
        this.socket.on('StatusSession-statusChange', function (data) {
            self.transport.html(data.transport);            
            self.count.html(data.connectionCount);
        });
    }
    
};
