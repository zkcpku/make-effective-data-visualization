//Capitalize first character of each word
String.prototype.capitalize = function(){
	return this.toLowerCase().replace( /\b\w/g, function (m) {
		return m.toUpperCase();
	});
};

//Toggle visibility
jQuery.fn.visible = function() {
	return this.css('visibility', 'visible');
};

jQuery.fn.invisible = function() {
	return this.css('visibility', 'hidden');
};

var app=angular.module('myApp',[]);


app.directive('scatterPlot', ['$interval','$compile',function($interval,$compile){
	// Instance the tour
	var tour = new Tour({storage: false, onEnd: function(tour){lock=false;}});
	// Add steps
	tour.addSteps([
		{ element: "#plot", title: "Story of TI", content: "The International (TI) is an annual electronic sports Dota 2 championship tournament. This visualization shows the overall performance of heroes picked in each TI." },
		 { element: ".title", title: "The First Internatinal", content: "Only limited number of heroes were picked in the tournament. There was no banning rule in this tournament. See how popular Windranger, Vengeful Spirit and Mirana were in the first tournament." },
		 { element: ".xaxis", title: "The Second Internatinal", content: "Slightly more heroes were picked in this tournament. Still no banning rule for heroes. See the pick rate drop of previous hot heroes? Now it's time for Leshrac, Tidehunter and Invoker.", onShow: function(tour){init = 2;update();}},
		 { element: "#plot", title: "The Internatinal 2013", content: "Hoho, huge number of new heroes were picked in this tournament. Insane variaty in TI3 right? The rule of banning heroes was added.", onShow: function(tour){init = 3;update();}},
		 { element: "#circle65", title: "Remember the Horror of Bat?", content: "Batrider actually got banned for 172 times in TI3.", onShow: function(tour){init = 3;update();hover(d3.select("#circle65").datum());lock=true;}, onNext: function(tour){lock=false;unhover(d3.select("#circle65").datum());}},
		 { element: "#circle54", title: "Gold Carry", content: "Lifestealer became the hottest carry in TI3.", onShow: function(tour){init = 3;update();hover(d3.select("#circle54").datum());lock=true;}, onNext: function(tour){lock=false;unhover(d3.select("#circle54").datum());}},
		 { element: "#plot", title: "The Internatinal 2014", content: "Time for TI4. Unlike the previous years, the tournament was held at the KeyArena, a multi-purpose arena in Seattle Center.", onShow: function(tour){init = 4;update();}},
		 { element: "#circle9", title: "Hero of the TI4?", content: "A wild mirana appeared everywhere!", onShow: function(tour){init = 4;update();hover(d3.select("#circle9").datum());lock=true;}, onNext: function(tour){lock=false;unhover(d3.select("#circle9").datum());}},
		 { element: "#circle77", title: "The rise of Lycan", content: "Such a high win rate with Lycan! Though it got banned most of the games.", onShow: function(tour){init = 4;update();hover(d3.select("#circle77").datum());lock=true;}, onNext: function(tour){lock=false;unhover(d3.select("#circle77").datum());}},
		 { element: ".title", title: "The Internatinal 2015", content: "Biggest TI ever! Total prize pool is over $18,000,000!", onShow: function(tour){init = 5;update();}},
		 { element: "#circle105", title: "New hero Techies", content: "Boom! New hero techies with a high win rate of 8 picks.", onShow: function(tour){init = 5;update();hover(d3.select("#circle105").datum());lock=true;}, onNext: function(tour){lock=false;unhover(d3.select("#circle105").datum());}},
		 { element: "#circle52", title: "Leshrac is way too strong!", content: "It either got banned or picked in most of the games of TI5. Wonder to see what will happen in the next patch.", onShow: function(tour){init = 5;update();hover(d3.select("#circle52").datum());lock=true;}, onNext: function(tour){lock=false;unhover(d3.select("#circle52").datum());}},
		{ element: "#circle17", title: "Hero", content: "Hover on the hero to see detailed information. The larger the circle, the bigger the total number of bans and picks of that hero."}, 
		{ element: "#circle17", title: "Click Hero", content: "Click the hero to track the movement. Click again to unlock the track."}, 
		{ element: ".tibutton-n", title: "Next", content: "Click the arrow to move around different TIs." }, 
		{ element: "#dropdownMenu3", title: "Change X", content: "You can change the data of the x axis. Feel free to explore your own TI story. Have fun!" } ]);
	//Bottom margin is set for unused heroes
	var width, margin, height, marginLeftRight, marginBottom;
	//x,y location for unused heroes
	var uX, uY, uDic;
	//Scale for x, y and size
	var xScale, yScale, pScale;
	//Items for x axis
	var items = ['_pick_rate', '_avg_xpm', '_avg_gpm', '_avg_K', '_avg_D', '_avg_A', '_avg_level', '_avg_hero_damage', '_avg_tower_damage'];
	//TI count
	var init = 1;
	//Item count
	var _init = 0;
	//Lock for hover function
	var lock = false;
	//Set size on unused hero
	var unusedSize;
	var data_global;

	function initialUnused() {
		//Set initial location for unused heroes
		uX = marginLeftRight;
		uY = height - 0.6*marginBottom;
		uDic = {};
	}

	//Set variables
	function setVariables() {
		//Set width, margin and height
		width = $("#plot_container").width();
		marginLeftRight = width * 0.07;
		margin = marginLeftRight;
		marginBottom = width * 0.2;
		height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		height = height*0.99;
		unusedSize = height * 0.02;
		initialUnused();

		//Set scale for x axis and y axis
		xScale = d3.scale.linear().range([margin,width-marginLeftRight]);
		yScale = d3.scale.linear().domain([0,1]).range([height-marginBottom,marginLeftRight]);
		//Set scale for the radius of circle
		pScale = d3.scale.pow().exponent(0.5).range([height/120,height/50]);
	}
	//Add items to drop-up menu
	function addDropMenu(scope) {
		$(".dropdown-menu").children().remove();
		for (item in items) {
			var itemName = items[item].replace("_avg_", "").replace(/_/g, " ").toUpperCase();
			var ele = "<li><a ng-click=\"setItem\("+ item +"\)\">"+ itemName +"</li></a>";
			var _ele = $compile(ele)(scope);
			$(".dropdown-menu").append(_ele);
		}
	}

	//Update custom y axis
	function setItem(n) {
		_init = n;
		update();
	}
	
	//Update to previous TI
	function previousTI() {
		init-=1;
		if (init == 0) init = 5;
		update();
	}

	//Update to next TI
	function nextTI() {
		init+=1;
		if (init > 5) init = init % 5;
		update();
	}
	
	//Update to previous y axis item
	function previousItem() {
		_init-=1;
		len = items.length;
		if (_init < 0) _init = len-1;
		update();
	}

	//Update to next y axis item
	function nextItem() {
		_init+=1;
		len = items.length;
		if (_init == len) _init = _init % len;
		update();
	}

	function initialize(scope, element) {
		//Bind scope
		scope.nextTI = nextTI;
		scope.previousTI = previousTI;
		scope.nextItem = nextItem;
		scope.previousItem = previousItem;
		scope.setItem = setItem;
		//Add drop-up menu
		addDropMenu(scope);
		//Append SVG
		d3.select(element[0])
			.append("svg")
			.attr("id", "plot")
			.attr("transform", "translate(0,"+ 80 + ")")
			.attr("width", width)
			.attr("height", height);
		d3.select(element[0])
			.append("svg")
			.attr("id", "myImg")
			.attr("height", 0)
			.attr("width", 0);
		//Set ti button height and location
		$(".tibutton").height($("#plot").height()*0.2);
		//Load data
		d3.json("data/dota.json",function(d){plot(d)});
	}

	//Repaint graph
	function resize(scope, element) {
		$("#plot").remove();
		$("#myImg").remove();
		setVariables();
		initialize(scope, element);
	}

	function link(scope,element,attr){
		//Initialize tour
		tour.init();
		$(window).load(function() {
			setVariables();
			initialize(scope, element);
			//Start tour
			tour.start();
		});
		//Repaint when resize
		$(window).resize(function() {
			resize(scope, element);
		});
	}


	function plot(data) {
		data_global = data;
		addImages(data);
		//Set domain for xScale and pScale
		xScale.domain([0,getMax()]).nice();
		pScale.domain([0,getMaxSize()]);
		var svg = d3.select('#plot');
		//Draw axises
		var xAxis = d3.svg.axis().orient('bottom').scale(xScale);
		var yAxis = d3.svg.axis().scale(yScale).orient('left').tickFormat(d3.format(".0%"));
		svg.append("g").attr("class","xaxis").style('opacity',0.5).attr("transform","translate(0,"+(height-marginBottom)+")").call(xAxis);
		svg.append("g").attr("class","yaxis").style('opacity',0.5).attr("transform","translate("+marginLeftRight+",0)").call(yAxis);
		//Add labels to both axises
		svg.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", margin/10)
			.attr("x",0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Win Rate");
		var xlabel = items[_init].replace("_avg_", "Average ").replace(/_/g, " ").toUpperCase();
		svg.append("text")
			.attr("class", "xlabel")
			.attr("y", $(".xaxis").offset().top+0.5*margin)
			.attr("x", (width / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text(xlabel);
		//Add title
		svg.append('text')
			.attr('class', 'title')
			.attr('x', width/2)
			.attr('y', margin/2)
			.attr('text-anchor', 'middle')
			.text('The International 201' + init)
			.attr("font-family", "sans-serif")
			.attr("font-size", "20px")
			.on("mouseover", function(d){showTitle(d);})
			.on("mouseout", function(d){showTerms();});
		//Draw scatter plot
		draw(data);	
		setButton();
	}
	
	//Set location for buttons around x axis
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

	//Return circle radius based on number of ban and pick
	function getSize() {
		return function(d){
			value = +d[init + '_pick'] + d[init + '_ban'];
			if (isNaN(value)) return unusedSize;
			else return pScale(value);
		};
	}

	//Add image patterns
	function addImages(data) {
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
	}

	//Plot circles
	function draw(data) {
		var svg = d3.select('#plot');
		svg.append('g')
			.attr("class", "bubble")
			.selectAll(".node")
			.data(data)
			.enter()
			.append("g")
			.attr("class", 'node');
		svg.selectAll(".node")
			.append("circle")
			.attr("cx", function(d){
				value = +d[init + items[_init]];
				if (isNaN(value)) return calUnusedX(d);
				else return xScale(value);})
			.attr("cy", function(d){
				value = +d[init +'_win_rate'];
				if (isNaN(value)) return uDic[d.hero];
				else return yScale(value);})
			.attr("r",getSize())
			.attr("fill",function(d){return "url(#hero" + d.hero + ")";})
			.attr("id", function(d){return "circle"+d.hero;})
			.attr('opacity', 0.6)
			.on("mouseover", function(d){hover(d);})
			.on("mouseout", function(d){unhover(d);})
			.on("click", function(d){hover(d);lock=!lock;});
	}

	//Set and show hero text of info panel
	function showInfo(d){
		$("#info-bubble img").attr("src", "images/heroes-sb/"+d.hero+".png");
		$("#hero_text").text(d.name);
		$("#win_text").text("Win: "+ (Number(d[init + "_win_rate"])*100).toFixed(2) + "%");
		$("#pick_text").text("Pick: "+ Number(d[init + "_pick"]));
		$("#ban_text").text("Ban: "+ Number(d[init + "_ban"]));
		$(".custom_text").remove();
		for (item in items){
			var nametag = items[item].replace("_avg_", "").replace(/_/g, " ").capitalize();
			nametag += ": ";
			$("#ban_text").after('<h4 class="custom_text">' +nametag + Number(d[init + items[item]]).toFixed(2)+"</h4>");
		}
		$("#info-terms").hide();
		$("#info-title").hide();
		$("#info-bubble").show();
	}
	
	//Display description for the tournament
	function showTitle(d) {
		$("#info-terms").hide();
		$("#info-bubble").hide();
		$("#info-title p").hide();
		$("#info-title").show();
		$("#info-title-" + init).show();
		setButton();
	}
	
	//Show terms
	function showTerms() {
		$("#info-bubble").hide();
		$("#info-title").hide();
		$("#info-terms").show();
		setButton();
	}

	
	function hover(d) {
		if (lock == false) {
			//Highlight mouse-on circle and dim other circles
			d3.selectAll('circle')
				.style('opacity', 0.1);
			d3.select("#circle"+d.hero)
				.style('opacity', 1)
				.attr("r", 1.5*getSize()(d));
			showInfo(d);
			setButton();
		}
	}

	//Restore circles when unhover
	function unhover(d) {
		if (lock == false) {
			d3.selectAll('circle')
				.style('opacity', 0.6);
			d3.select("#circle"+d.hero)
				.attr("r", getSize()(d));
			showTerms();
			setButton();
		}
	}

	//Get the max value of the x domain data
	function getMax() {
		var arr = [];
		for (i=1; i < 6; i++) {
			arr.push(d3.max(data_global, function(d){return +d[i+ items[_init]];}));
		}
		var maxVal = Math.max.apply(Math, arr);
		return maxVal;
	}

	//Get the max value of the radius domain data
	function getMaxSize() {
		var maxVal = d3.max(data_global, function(d){return +(+d[init+'_pick']+d[init+'_ban']);});
		return maxVal;
	}

	//Update the plot 
	function update() {
		//Clear uX, uY
		uX = marginLeftRight;
		uY = height - 0.6*marginBottom;
		//Update x axis and its label
		xScale.domain([0,getMax()]).nice();
		//Update scale for size
		pScale.domain([0,getMaxSize()]);
		var xAxis = d3.svg.axis().orient('bottom').scale(xScale);
		d3.select(".xaxis").transition().call(xAxis);
		var xlabel = items[_init].replace("_avg_", "Average ").replace(/_/g, " ").toUpperCase();
		d3.select(".xlabel").text(xlabel);
		//Update circle radius and location
		d3.select('svg').selectAll("circle")
			.transition()
			.duration(1000)
			.attr("cx", function(d){
				value = +d[init + items[_init]];
				if (isNaN(value)) return calUnusedX(d);
				else return xScale(value);})
			.attr("r", getSize())
			.attr("cy", function(d){
				value = +d[init +'_win_rate'];
				if (isNaN(value)) return uDic[d.hero];
				else return yScale(value);});
		//Update title
		d3.select('.title')
			.text('The International 201' + init);
		//Update button location
		setButton();

	}

	function calUnusedX(d) {
		uX = uX + unusedSize*2;
		if (uX > 0.8 * width) {
			uX = marginLeftRight + unusedSize*2;
			uY = uY + unusedSize*2;
		}
		uDic[d.hero] = uY;
		return uX;
	}


	return {
		link: link,
		restrict: 'E'
	}

}]);
