/*Passcheck Script v1.0*/

$(document).ready(function(){

	//Variable Declaration
	var strFname;
	var strFnamelc;
	var strSname;
	var strSnamelc;
	var strPassword;
	var charPassword;
	var complex = $("#complex");
	var minPasswordLength = 8;
	var maxPasswordLength = 20;
	var baseScore = 0, score = 0;

	var num = {};
	num.Excess = 0;
	num.Upper = 0;
	num.Numbers = 0;
	num.Symbols = 0;

	var bonus = {};
	bonus.Excess = 3;
	bonus.Upper = 4;
	bonus.Numbers = 5;
	bonus.Symbols = 5;
	bonus.Combo = 0;
	bonus.FlatLower = 0;
	bonus.FlatNumber = 0;

	outputResult();
	$("#inputPassword").bind("keyup", checkVal);

	//Check that the Password entered is compliant with the rules
	function checkVal(){
		init();

		if (charPassword.length >=minPasswordLength){
			baseScore = 50;
			analyzeString();
			calcComplex();
		}else{
			baseScore = 0;
		}
		outputResult();
	}

	function init(){
		strPassword = $("#inputPassword").val();
		strFname= $("#fname").val();
		strSname = $("#sname").val();
		strFnamelc = $("#fname").val().toLowerCase();
		strSnamelc = $("#sname").val().toLowerCase();
		charPassword = strPassword.split("");

		num.Excess = 0;
		num.Upper = 0;
		num.Numbers = 0;
		num.Symbols = 0;
		bonus.Combo = 0; 
		bonus.FlatLower = 0;
		bonus.FlatNumber = 0;
		baseScore = 0;
		score =0;
	}

	function analyzeString(){
		//Check the String for use of Caps, Numbers and Symbols
		for (i=0; i<charPassword.length; i++){
			if (charPassword[i].match(/[A-Z]/g)){num.Upper++;}
			if (charPassword[i].match(/[0-9]/g)){num.Numbers++;}
			if (charPassword[i].match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)){num.Symbols++;}
		}

		//If there are more than 5 numbers, stop increasing the score
		if (num.Numbers > 5){
			num.Numbers = 5;
		}

		//Sets Excess to the amount of characters after the minimum password length
		num.Excess = charPassword.length - minPasswordLength;

		//If the String contains Caps, Numbers and Symbols the user gets a bonus
		if (num.Upper && num.Numbers && num.Symbols){
			bonus.Combo = 25;
		}
		//If the String contains a combination of two, then they get a smaller bonus.
		else if ((num.Upper && num.Numbers) || (num.Upper && num.Symbols) || (num.Numbers && num.Symbols)){
			bonus.Combo = 15;
		}

		//If the String contains only lower case letters, they get a penalty
		if (strPassword.match(/^[\sa-z]+$/)){
			bonus.FlatLower = -15;
		}

		//If the String contains only numbers, they get a bigger penalty
		if (strPassword.match(/^[\s0-9]+$/)){
			bonus.FlatNumber = -111;
		}
	}

	//Function that calculates the score
	function calcComplex(){
		score = baseScore 
			+ (num.Excess*bonus.Excess) 
			+ (num.Upper*bonus.Upper) 
			+ (num.Numbers*bonus.Numbers) 
			+ (num.Symbols*bonus.Symbols) 
			+ bonus.Combo 
			+ bonus.FlatLower 
			+ bonus.FlatNumber;
	}

	//Function that displays the results in the HTML file.
	function outputResult(){
		if ($("#inputPassword").val()== ""){
			complex.html("Enter a password to check").removeClass("weak strong stronger strongest").addClass("default");
		}else if (charPassword.length < minPasswordLength){
			complex.html("At least " + minPasswordLength+ " characters please!").removeClass("strong stronger strongest").addClass("weak");
		}else if (strPassword.indexOf("password") > -1){
			complex.html("Seriously, your password is password?").removeClass("strong stronger strongest").addClass("weak");
		}else if (strPassword.indexOf(strFname) > -1){
			complex.html("It is unwise to use your name in your password").removeClass("strong stronger strongest").addClass("weak");
		}else if (strPassword.indexOf(strFnamelc) > -1){
			complex.html("It is unwise to use your name in your password").removeClass("strong stronger strongest").addClass("weak");
		}else if (strPassword.indexOf(strSname) > -1){
			complex.html("It is unwise to use your surname in your password").removeClass("strong stronger strongest").addClass("weak");
		}else if (strPassword.indexOf(strSnamelc) > -1){
			complex.html("It is unwise to use your surname in your password").removeClass("strong stronger strongest").addClass("weak");
		}else if (score<50){
			complex.html("Weak!").removeClass("strong stronger strongest").addClass("weak");
		}else if (score>=50 && score<75){
			complex.html("Average!").removeClass("stronger strongest").addClass("strong");
		}else if (score>=75 && score<100){
			complex.html("Strong!").removeClass("strongest").addClass("stronger");
		}else if (score>=100){
			complex.html("Secure!").addClass("strongest");
		}

		$("#details").html("Base Score :<span class=\"value\">" + baseScore + "</span>"
						+ "<br />Length Bonus:<span class=\"value\">" + (num.Excess*bonus.Excess) + "</span>"
						+ "<br />Upper Case Bonus:<span class=\"value\">" + (num.Upper*bonus.Upper) + "</span>"
						+ "<br />Number Bonus:<span class=\"value\">" + (num.Numbers*bonus.Numbers) + "</span>"
						+ "<br />Symbol Bonus:<span class=\"value\">" + (num.Symbols*bonus.Symbols) + "</span>"
						+ "<br />Combination Bonus:<span class=\"value\">" + bonus.Combo + "</span>"
						+ "<br />Lower Case Only Penalty:<span class=\"value\">" + bonus.FlatLower + "</span>"
						+ "<br />Numbers Only Penalty:<span class=\"value\">" + bonus.FlatNumber + "</span>"
						+ "<br />Total Score:<span class=\"value\">" + score + "</span>" );
	}
});