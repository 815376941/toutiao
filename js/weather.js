// 获取一级城市
var date;
$.ajax({
	url:"http://api.jisuapi.com/weather/city?appkey=43b6a1c7f79e0c58",
	dataType:"jsonp",
	success:function(val){
		date = val.result;
		var province = $.grep(date,function(val,index){
			return val.parentid == 0;
		})
		// console.log(province);
		// console.log(date);
		$.each($(".province li"),function(index,val){
			$(val).html(province[index].city);
			$(val).attr("provinceid",province[index].cityid);
		})
	}
});

// 获取二级地区
$(".province li").each(function(index,ele){
	$(ele).click(function(){
		$(".province li").removeClass("select");
		$(".area").html("");

		$(ele).addClass("select");
		var city = $.grep(date,function(val,index){
			return val.parentid == $(ele).attr("provinceid");
		})
		$.each(city,function(index,val){
			var li = $("<li></li>");
			li.html(val.city);
			$(".area").append(li);
		})	
	})
})

$(".area").on("click","li",function(){
	getFullWeather($(this).html());
})


$.getScript("http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",function(){
    getFullWeather(remote_ip_info.city)
});

var weatherobj;
function getFullWeather(city){
	$(".now-city").html(city);
	$.ajax({
		url:"http://api.jisuapi.com/weather/query?appkey=43b6a1c7f79e0c58&city="+city,
		dataType:"jsonp",
		success:function(val){
			weatherobj = val.result;
			$(".now-state span").html(weatherobj.temp+"°");
			$(".now-state .weather").html(weatherobj.weather);
			$(".now-state .tmps").html(weatherobj.temphigh+"° ~"+weatherobj.templow+"°");
			$(".now-state img").attr("src","img/"+weatherobj.img+".png");
			//未来几小时
            $(".hourly ul li").each(function (index, ele) {
                $(ele).find("time").html(weatherobj.hourly[index].time);
                $(ele).find("img").attr("src", "img/" + weatherobj.hourly[index].img + ".png");
                $(ele).find("p").html(weatherobj.hourly[index].temp + "°");
            });

            //未来几天
             $(".week li").each(function (index, ele) {
                $(ele).find("time").html(weatherobj.daily[index + 1].date + "&nbsp;" + weatherobj.daily[index + 1].week);
                $(ele).find("img").attr("src", "img/" + weatherobj.daily[index + 1].day.img + ".png");
                $(ele).find("p").html(weatherobj.daily[index + 1].day.temphigh + "°/" + weatherobj.daily[index + 1].night.templow + "°")
            });

		}
	})
}
