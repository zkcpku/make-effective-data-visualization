String.prototype.capitalize = function(){
	return this.toLowerCase().replace( /\b\w/g, function (m) {
		return m.toUpperCase();
	});
};
var app=angular.module('myApp',[]);

jQuery.fn.visible = function() {
	console.log('show');
	return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
	return this.css('visibility', 'hidden');
};

app.directive('scatterPlot', ['$interval','$compile',function($interval,$compile){
	var width = $("#plot_container").width();
	var margin = width * 0.07;
	var height = window.innerHeight
	|| document.documentElement.clientHeight
	|| document.body.clientHeight;
	height = height*0.9;

var xScale = d3.scale.linear().range([margin,width-margin]);
var yScale = d3.scale.linear().domain([0,1]).range([height-margin,margin]);
var pScale = d3.scale.pow().exponent(0.5).range([height/100,height/80]);

var items = ['_avg_xpm', '_avg_gpm', '_avg_K', '_avg_D', '_avg_A', '_avg_level', '_avg_hero_damage', 
	'_avg_tower_damage'];

var init = 1;
var _init = 0;
var lock = false;
var data_global;
var timeInterval = 5000;

function addDropMenu(scope) {
	for (item in items) {
		var itemName = items[item].replace("_avg_", "").replace("_", " ").toUpperCase();
		var ele = "<li><a ng-click=\"setItem\("+ item +"\)\">"+ itemName +"</li></a>";
		var _ele = $compile(ele)(scope);
		$(".dropdown-menu").append(_ele);
	}
}


function start(time) {
	timer = $interval(function() {
		init += 1;
		if (init >5) init = init % 5;
		update_in();
	},time);
	return timer;
}

function setItem(n) {
	_init = n;
	update();
}

function previousTI() {
	init-=1;
	if (init == 0) init = 5;
	update();
}

function nextTI() {
	init+=1;
	if (init > 5) init = init % 5;
	update();
}

function previousItem() {
	_init-=1;
	len = items.length;
	if (_init < 0) _init = len-1;
	update();
}

function nextItem() {
	_init+=1;
	len = items.length;
	if (_init == len) _init = _init % len;
	update();
}

function initialize() {
	$(".tibutton").height(height);
	d3.json("/data/dota.json",
			function(d){plot(d)});
}

function link(scope,element,attr){
	scope.nextTI = nextTI;
	scope.previousTI = previousTI;
	scope.nextItem = nextItem;
	scope.previousItem = previousItem;
	scope.setItem = setItem;
	addDropMenu(scope);
	d3.select(element[0]).append('svg').attr('id','plot').attr('transform', 'translate(0,'+ 80 + ')');
			d3.select(element[0]).append('svg').attr('id','myImg').attr('height',0).attr('width',0);
			initialize();
			}


			function plot(data) {
				data_global = data;
				var arr = [];
				var _arr = [];
				for (i=1; i < 6; i++) {
					arr.push(d3.max(data, function(d){return +d[i+ items[_init]];}));
					_arr.push(d3.max(data, function(d){return +(+d[i+'_pick']+d[i+'_ban']);}));
				}
				var maxVal = Math.max.apply(Math, arr);
				var _maxVal = Math.max.apply(Math, _arr);
				xScale.domain([0,maxVal]).nice();
				pScale.domain([0,maxVal]);
				var svg = d3.select('svg');
				svg.attr('width', width).attr('height', height);
				var xAxis = d3.svg.axis().orient('bottom').scale(xScale);
				var yAxis = d3.svg.axis().scale(yScale).orient('left').tickFormat(d3.format(".0%"));
				svg.append("g").attr("class","xaxis").style('opacity',0.5).attr("transform","translate(0,"+(height-margin)+")").call(xAxis);
				svg.append("g").attr("class","yaxis").style('opacity',0.5).attr("transform","translate("+margin+",0)").call(yAxis);
				svg.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", margin/10)
					.attr("x",0 - (height / 2))
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.text("Win Rate");
				var xlabel = items[_init].replace("_avg_", "Average ").replace("_", " ").toUpperCase();
				svg.append("text")
					.attr("class", "xlabel")
					.attr("y", height-0.5*margin)
					.attr("x", (width / 2))
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.text(xlabel);
				draw(data,init);	
				setButton();
			}

function setButton(){
	var offset = $(".xlabel").offset();
	var tmp_w = $(".xlabel").width();
	var button1_w = $("#previous-item").outerWidth();
	var button2_w = $("#dropdownMenu3").outerWidth();
	$("#dropup1").offset({ top: offset.top-15, left: (offset.left+tmp_w+2)});
	$("#dropup1").width(button2_w);
	$("#previous-item").offset({ top: offset.top-15, left: (offset.left-button1_w)});
	$("#next-item").offset({ top: offset.top-15, left: (offset.left+tmp_w+button2_w)});

}

function getSize() {
	return function(d){
		value = +d[init + '_pick'] + d[init + '_ban'];
		if (isNaN(value)) return 0;
		else return pScale(value);
	};
}


function draw(data) {
	var svg = d3.select('#plot');
	svg.append("g")
		.attr("class", "tooltip")
		.selectAll(".toolnode")
		.data(data)
		.enter()
		.append("g")
		.attr("class","toolnode");
	svg.append('g')
		.attr("class", "bubble")
		.selectAll(".node")
		.data(data)
		.enter()
		.append("g")
		.attr("class", 'node');
	d3.select('#myImg')
		.append('defs');
	d3.select('defs')
		.selectAll('pattern')
		.data(data)
		.enter()
		.append("pattern")
		.attr('id',function(d){return 'hero'+d.hero;})
		.attr('height', "100%")
		.attr('width',"100%")
		.attr('patternContentUnits', "objectBoundingBox")
		.append('image')
		.attr('preserveAspectRatio', 'none')
		.attr('width',1)
		.attr('height',1)
		.attr("xlink:href",function(d){return "images/heroes-sb/" + d.hero + ".png";});
	svg.selectAll(".node")
		.append("circle")
		.attr("cx", function(d){
			value = +d[init + items[_init]];
			if (isNaN(value)) return -100;
			else return xScale(value);})
		.attr("cy", function(d){
			value = +d[init +'_win_rate'];
			if (isNaN(value)) return -100;
			else return yScale(value)-10;})
		.attr("r",getSize())
		.attr("fill",function(d){return "url(#hero" + d.hero + ")";})
		.attr("id", function(d){return "circle"+d.hero;})
		.attr('opacity', 0.6)
		.on("mouseover", function(d){hover(d);})
		.on("mouseout", function(d){unhover(d);});
	svg.append('text')
		.attr('class', 'title')
		.attr('x', width/2)
		.attr('y', margin/2)
		.attr('text-anchor', 'middle')
		.text('The International ' + init);
}

function setInfo(d){
	$("#info img").attr("src", "images/heroes-sb/"+d.hero+".png");
	$("#info #hero_text").text(d.name);
	$("#info #win_text").text("Win: "+ (Number(d[init + "_win_rate"])*100).toFixed(2) + "%");
	$("#info #pick_text").text("Pick: "+ Number(d[init + "_pick"]));
	$("#info #ban_text").text("Ban: "+ Number(d[init + "_ban"]));
	$(".custom_text").remove();
	for (item in items){
		var nametag = items[item].replace("_avg_", "").replace("_", " ").capitalize();
		nametag += ": ";
		$("#info #ban_text").after('<h4 class="custom_text">' +nametag + Number(d[init + items[item]]).toFixed(2)+"</h4>");
	}
	$("#info").visible();
}

function hover(d) {
	if (lock == false) {
		d3.selectAll('circle')
			.style('opacity', 0.1);
		d3.select("#circle"+d.hero)
			.style('opacity', 1)
			.attr("r", 1.5*getSize()(d));
		setInfo(d);
		lock = true;
	}
}

function unhover(d) {
	if (lock == true) {
		d3.selectAll('circle')
			.style('opacity', 0.6);
		d3.select("#circle"+d.hero)
			.attr("r", getSize()(d));
		$("#info").invisible();
		lock = false;
	}
}

function update() {
	var arr = [];
	for (i=1; i < 6; i++) {
		arr.push(d3.max(data_global, function(d){return +d[i+ items[_init]];}));
	}
	var maxVal = Math.max.apply(Math, arr);
	console.log(arr);
	xScale.domain([0,maxVal]).nice();
	var xAxis = d3.svg.axis().orient('bottom').scale(xScale);
	d3.select(".xaxis").transition().call(xAxis);
	var xlabel = items[_init].replace("_avg_", "Average ").replace("_", " ").toUpperCase();
	d3.select(".xlabel").text(xlabel);

	d3.select('svg').selectAll("circle")
		.transition()
		.duration(1000)
		.attr("cx", function(d){
			value = +d[init + items[_init]];
			if (isNaN(value)) return -100;
			else return xScale(value);})
		.attr("cy", function(d){
			value = +d[init +'_win_rate'];
			if (isNaN(value)) return -100;
			else return yScale(value)-10;})
		.attr("r",getSize());
	d3.select('.title')
		.text('The International ' + init);
	setButton();

}


return {
	link: link,
	restrict: 'E'
}

}]);
