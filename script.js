var choiceBeverage = [];
var choiceAmount = [];
var OrangeJuice = [];
var caloricValue = [];
var totalCal = [];
var exerciseMinutes	= [];
var circuitCount = [];
var exerciseOption = [];
var randomExercises = [];
var randomize = [];

var backgrounds = ["images/beer.svg", "images/bottles.svg", "images/champagne.svg", "images/cheers.svg", "images/martini.svg", "images/cocktail.svg"];

var exercises = {
		list: [
			{"name": "running",
			"image": "images/runner.svg"},
			{"name": "rowing",
			"image": "images/rower.svg"},
			{"name": "skipping",
			"image": "images/skipping.svg"},
			{"name": "elliptical",
			"image": "images/elliptical.svg"},
			{"name": "biking",
			"image": "images/biking.svg"},
			{"name": "swimming",
			"image": "images/swimmer.svg"},
			{"name": "jump lunges",
			"image": "images/jump_lunges.svg"},
			{"name": "stair climbing",
			"image": "images/climbing.svg"}
		]
	}

var alcApp = {};
alcApp.key = '7mHTIcSCjRLl0priJDB8UMKm2yGGG0TAXWbItjjo';

$(function(){
	alcApp.init();

});

alcApp.init = function(){
	var randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
	$('header div.imgContainer img').attr('src', randomBackground);

	$("input[type='radio']").click(function (){
		var drink = $("input[name='beverage']:checked").attr('placeholder');
		var drinkID = $("input[name='beverage']:checked").attr('id');
			if(drink){
				$('#amount h2 span').text(drink);
			}
			if(drinkID == "beer" || drinkID == "lightBeer") {
				$('#amount p.servingName').text('bottle(s)');
				$('#amount p.ml').text('341ml');
			} else if (drinkID == "redWine" || drinkID == "whiteWine") {
				$('#amount p').text('glass(es)');
				$('#amount p.ml').text('266ml');
			} else if (drinkID == "vodka") {
				$('#amount p').text('glass(es)');
				$('#amount p.ml').text('30ml alcohol, 236ml juice or soda');
			} else {
				$('#amount p').text('shot(s)');
				$('#amount p.ml').text('30ml');
			}	
	});

	$('form').on('submit', function (e) {
		// don't refresh page
		e.preventDefault();
		// save the user's answers
		choiceBeverage = $('input[name=beverage]:checked').val();
		choiceAmount = $('input[name=amount]').val();
		alcApp.getIDNum();
		$('#questions').hide();
		$('#answers').fadeIn();
	});
}

alcApp.getIDNum = function(){
	$.ajax({
		url: 'http://api.nal.usda.gov/ndb/search/',
		method: 'GET',
		dataType: 'json',
		data: {
			format: 'json',
			api_key: alcApp.key,
			q: choiceBeverage
		}
	}).then(function(data) {
		var beverages = [];
		var searchResults = data.list.item;
		var searchGroup = searchResults.group;
		$.each(searchResults, function(i, data) {
			if (searchResults[i].group == 'Beverages') {
				beverages.push(searchResults[i]);
			}
		})
		alcApp.getCalories(beverages[0].ndbno);
	});
}

alcApp.getCalories = function(IDnum) {
	var ndbno = IDnum;
	$.ajax({
		url: 'http://api.nal.usda.gov/ndb/reports/',
		method: 'GET',
		dataType: 'json',
		data: {
			format: 'json',
			api_key: alcApp.key,
			ndbno: '09206'
			}
		}).then(function(OJdata) {
			OrangeJuice = OJdata.report.food.nutrients[1].value; //returns caloric value of OJ per 100g.
		});
	$.ajax({
		url: 'http://api.nal.usda.gov/ndb/reports/',
		method: 'GET',
		dataType: 'json',
		data: {
			format: 'json',
			api_key: alcApp.key,
			ndbno: ndbno
			}
		}).then(function(data) {
			caloricValue = data.report.food.nutrients[1].value; //returns caloric value of beverage per 100g.
			alcApp.calcCalories(caloricValue);
		});
}

alcApp.calcCalories = function (caloricValue) {
	// use if statement to get totalCal variable
		if(choiceBeverage == "regular beer" || choiceBeverage == "light beer") {
				totalCal = ((choiceAmount * 341) * (caloricValue / 100)); //for 341ml serving size
			} else if (choiceBeverage == "red wine" || choiceBeverage == "white wine") {
				totalCal = ((choiceAmount * 266) * (caloricValue / 100)); //for 266ml serving size
			} else if (choiceBeverage == "vodka"){
				totalCal = ((choiceAmount * 30) * (caloricValue / 100)) + ((choiceAmount * 236) * (OrangeJuice / 100));
			} else {
				totalCal = ((choiceAmount * 30) * (caloricValue / 100)); //for 29.5ml servingSize
			}
			alcApp.calcCircuit(totalCal);
	}

alcApp.calcCircuit = function(rawCal){
	totalCal = Math.round(rawCal);
	$('#answers h3.calCount span').text(totalCal);
	exerciseMinutes = Math.round(totalCal / 10);
	$('#answers p.exerciseMin span').text(exerciseMinutes);
	if (exerciseMinutes <= 60) {
		circuitCount = 1;
		exerciseOption = Math.round(exerciseMinutes / 4);
		$('#answers p.resultResponse span').text("Let's neutralize those drinks!");
		$('#answers p.circuitDesc').text("Run through these exercises once.");
	} else if (exerciseMinutes >61 && exerciseMinutes <=90) {
		circuitCount = 2;
		var perMinute = exerciseMinutes / 4;
		exerciseOption = Math.round(perMinute / circuitCount);
		$('#answers p.resultResponse span').text("It sounds like you had a great night - let's neutralize those drinks!");
		$('#answers p.circuitDesc').text("Run through these exercises " + circuitCount + " times.");
	} else if (exerciseMinutes >91 && exerciseMinutes <=120) {
		circuitCount = 3;
		var perMinute = exerciseMinutes / 4;
		exerciseOption = Math.round(perMinute / circuitCount);
		$('#answers p.resultResponse span').text("It sounds like you had a great night - let's neutralize those drinks!");
		$('#answers p.circuitDesc').text("Run through these exercises " + circuitCount + " times.");
	} else if (exerciseMinutes >121 && exerciseMinutes <=150) {
		circuitCount = 4;
		var perMinute = exerciseMinutes / 4;
		exerciseOption = Math.round(perMinute / circuitCount);
		$('#answers p.resultResponse span').text("It sounds like you had a great night - let's neutralize those drinks!");
		$('#answers p.circuitDesc').text("Run through these exercises " + circuitCount + " times.");
	} else if (exerciseMinutes >151 && exerciseMinutes <=180) {
		circuitCount = 5;
		exerciseOption = Math.round((exerciseMinutes / 4) / circuitCount);
		$('#answers p.resultResponse span').text("Let's neutralize those drinks! But maybe you should work out tomorrow, and take a  recovery day today.");
		$('#answers p.circuitDesc').text("Run through these exercises " + circuitCount + " times. Split the " + circuitCount + " circuits between a few days.");
	} else if (exerciseMinutes >181 && exerciseMinutes <=210) {
		circuitCount = 6;
		var perMinute = exerciseMinutes / 4;
		exerciseOption = Math.round(perMinute / circuitCount);
		$('#answers p.resultResponse span').text("Let's neutralize those drinks! But maybe you should work out tomorrow, and take a  recovery day today.");
		$('#answers p.circuitDesc').text("Run through these exercises " + circuitCount + " times. Split the " + circuitCount + " circuits between a few days.");
	} else if (exerciseMinutes >211 && exerciseMinutes <=240) {
		circuitCount = 7;
		var perMinute = exerciseMinutes / 4;
		exerciseOption = Math.round(perMinute / circuitCount);
		$('#answers p.resultResponse span').text("Let's neutralize those drinks! But maybe you should work out tomorrow, and take a  recovery day today.");
		$('#answers p.circuitDesc').text("Run through these exercises " + circuitCount + " times. Split the " + circuitCount + " circuits between a few days.");
	} else if (exerciseMinutes >241 && exerciseMinutes <=270) {
		circuitCount = 8;
		var perMinute = exerciseMinutes / 4;
		exerciseOption = Math.round(perMinute / circuitCount);
		$('#answers p.resultResponse span').text("Let's neutralize those drinks! But maybe you should work out tomorrow, and take a  recovery day today.");
		$('#answers p.circuitDesc').text("Run through these exercises " + circuitCount + " times. Split the " + circuitCount + " circuits between a few days.");
	} else {
		circuitCount = 9;
		var perMinute = exerciseMinutes / 4;
		exerciseOption = Math.round(perMinute / circuitCount);
		$('#answers p.resultResponse span').text("Let's neutralize those drinks! But maybe you should work out tomorrow, and take a  recovery day today.");
		$('#answers p.circuitDesc').text("Run through these exercises " + circuitCount + " times. Split the " + circuitCount + " circuits between a few days.");
	}
	$('#answers p.number span').text(exerciseOption);
	alcApp.displayExercises();
}

alcApp.displayExercises = function() {
		 // for (var i = 0; i < 4; ++i) {
   //   	var item = exercises.list[Math.floor(Math.random() * exercises.list.length)];
   //   		randomExercises.push(item);
		 // }

	// $('#answers div.e1 h4').text(randomExercises[0].name);
	// $('#answers div.e1 img').attr("src", randomExercises[0].image);
	// $('#answers div.e2 h4').text(randomExercises[1].name);
	// $('#answers div.e2 img').attr("src", randomExercises[1].image);
	// $('#answers div.e3 h4').text(randomExercises[2].name);
	// $('#answers div.e3 img').attr("src", randomExercises[2].image);
	// $('#answers div.e4 h4').text(randomExercises[3].name);
	// $('#answers div.e4 img').attr("src", randomExercises[3].image);

	$('#answers div.e1 h4').text(exercises.list[0].name);
	$('#answers div.e1 img').attr("src", exercises.list[0].image);
	$('#answers div.e2 h4').text(exercises.list[1].name);
	$('#answers div.e2 img').attr("src", exercises.list[1].image);
	$('#answers div.e3 h4').text(exercises.list[2].name);
	$('#answers div.e3 img').attr("src", exercises.list[2].image);
	$('#answers div.e4 h4').text(exercises.list[3].name);
	$('#answers div.e4 img').attr("src", exercises.list[3].image);

	$('button.restart').on('click', function() {
		window.location.reload(true);
		});
	}
