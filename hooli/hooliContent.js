$(".facebook-like-container").hide();
$(".functional-bar.beacon").append($('<button id="likebutton" type="button" class="btn btn-success btn-sm">Like</button>'));

$(document).ready(function(){
	var ratio = 2.5;
	var delay = 5000;
	var ori_top = $("#player-container").offset().top;
	var ori_left = $("#player-container").offset().left;
	setTimeout(function() {
		var edge = true;
		var top = $("#player-container").offset().top;
		var left = $("#player-container").offset().left;
		var height = $("#player-container").height();
		var width = $("#player-container").width();
		left = $(window).width()-width/ratio-left/ratio;
		$("#player-container").each(function(){
			$(this).css('z-index',9998);
		});
        d3.select()
        $("#likebutton").click(function() {
            var bezier_params = {
                start: { 
                  x: 185, 
                  y: 185, 
                  angle: 10
                },  
                end: { 
                  x:540,
                  y:110, 
                  angle: -10, 
                  length: 0.25
                }
              }
            var layer = $('<div style="width:'+width+'px; height:'+height+'px; top:'+top+'px; left:'+left+'px; position: absolute;"><p id="danlike">I Like this video</p></div>')
            layer.css('z-index', 9999);
            $('.video-player-root').append(layer);
            console.log($("#danlike"));
            console.log($("#danlike").animate({path : new $.path.bezier(bezier_params)}));
            $("#danlike").animate({path : new $.path.bezier(bezier_params)});
        })
		var rtime;
		var timeout = false;
		//heartbeat, check every 200 time
		var delta = 200;
		$(window).resize(function() {
			var fold = top+height-$(window).scrollTop();
	        if (fold > 0 && edge==true){
	   			$("#player-container").width(width);
			   	$("#player-container").height(height);
			   	$("#player-container #site-player").width(width);
			   	$("#player-container #site-player").height(height);
	   		}
	   		else if (fold <= 0 && edge==false){
	   			$("#player-container").width(width/ratio);
			   	$("#player-container").height(height/ratio);
			   	$("#player-container #site-player").width(width/ratio);
			   	$("#player-container #site-player").height(height/ratio);
	   		}
		    rtime = new Date();
		    if (timeout === false) {
		        timeout = true;
		        setTimeout(resizeend, delta);
		    }
		});

		function resizeend() {
		    if (new Date() - rtime < delta) {
		        setTimeout(resizeend, delta);
		    } else {
		        timeout = false;
		        $("#player-container").delay(200).each(function(){
		        	var fold = top+height-$(window).scrollTop();
			        if (fold > 0 && edge==true){
			        	$(this).width(width);
					   	$(this).height(height);
					   	$("#site-player").width(width);
					   	$("#site-player").height(height);
			   		}
			   		else if (fold <= 0 && edge==false){
			   			$(this).width(width/ratio);
				   		$(this).height(height/ratio);
				   		$("#site-player").width(width/ratio);
				   		$("#site-player").height(height/ratio);
			   		}
		        });
		    }               
		}

		$(window).bind("scroll", function(event){
		    $("#player-container").each(function(){
		    	//noinspection JSValidateTypes
				var fold = ori_top+height-$(window).scrollTop();
		    	if( fold<=0){
		    		$(this).offset({top: $(window).scrollTop()+ top, left: left});
		    	}
		    	else{
					$(this).offset({top: ori_top, left: ori_left});
					top = ori_top;
					left = $(window).width()-width/ratio-ori_left/ratio;;
		    	}
		   		if( fold <= 0 && edge==true){
		   			edge = false;
					$("#player-container").css('position','absolute');
		    		$(this).trigger("zoomIn");
		   		}
		   		else if ( fold >0 && edge==false){
		   			edge = true;
					$(this).css('position','');
		   			$(this).trigger("zoomOut");
		   		}
		   		else if (fold > 0 && edge==true){
		   			$(this).width(width);
				   	$(this).height(height);
				   	$("#site-player").width(width);
				   	$("#site-player").height(height);
		   		}
		   		else if (fold <= 0 && edge==false){
		   			$(this).width(width/ratio);
				   	$(this).height(height/ratio);
				   	$("#site-player").width(width/ratio);
				   	$("#site-player").height(height/ratio);
		   		}
		   	});
		});

        $("#player-container").click(function(){
            var fold = top+height-$(window).scrollTop();
            if(fold<=0){
                $(".hint").hide();
                $(".pause-title").hide();
            }
            else{
                $(".hint").show();
                $(".pause-title").show();
            }
        });

        $('#player-container').mousedown(
        function (event) {
            var isMove = true;
			var top_t = 0
            var abs_x = event.pageX - $("#player-container").offset().left;
            var abs_y = event.pageY - $("#player-container").offset().top;
            $(document).mousemove(function (event) {
                if (isMove) {
                    var obj = $('#player-container');
					left = event.pageX - abs_x;
					top_t = event.pageY-abs_y;
                    obj.css({'left': left, 'top': top_t});
                }
            }).mouseup(
                function (event) {
					top = top_t - $(window).scrollTop();
                    isMove = false;
                });
        });
	}, delay);

	$("#player-container").on("zoomIn",function(){
		$(".main-bar").hide();
		$(".main-bar-background").hide();
	   	var w = $(this).width()/ratio;
	   	var h = $(this).height()/ratio;
	   	$(this).width(w);
	    $(this).height(h);
	   	$("#site-player").width(w);
	   	$("#site-player").height(h);
        $(".hint").hide();
        $(".pause-title").hide();
	});

	$("#player-container").on("zoomOut",function(){
        $(".hint").show();
        $(".pause-title").show();
        $(".remain-time").show();
        $(".main-bar").show();
	    $(".main-bar-background").show();
	    var w = $(this).width()*ratio;
	    var h = $(this).height()*ratio;
	    $(this).width(w);
	    $(this).height(h);
	    $("#site-player").width(w);
	    $("#site-player").height(h);
        if($(".pause-text").css("display") === "none"){
            $(".hint").show();
            $(".pause-title").show();
        }
        else{
            $(".hint").hide();
            $(".pause-title").hide();
        }
	});
});

