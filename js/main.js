// Russell Gaspard
// Project 4
// Visual Frameworks - VFW 1304
// Mobile Development
// Full Sail University


//Wait until the page DOM content has loaded
window.addEventListener("DOMContentLoaded", function(){

	//Element Selection Function
	function id(id){
		var thisElement = document.getElementById(id);
		return thisElement;
	}

	//Build Instrument Selector
	function makePrimaryList(){
		var theForm = document.forms[0];
		var pSelect = id("pSelect");
		var newSelect = document.createElement('select');
		newSelect.setAttribute("id", "primary");
		for(var i=0, j=pInstrument.length; i<j; i++){
			var newOption = document.createElement('option');
			var text = pInstrument[i];
			newOption.setAttribute("value", text);
			newOption.innerHTML = text;
			newSelect.appendChild(newOption);
		};
		pSelect.appendChild(newSelect);
	};

	//find which checkboxes are checked
	function getAllInstruments(){
		var checks = document.forms[0].all;
		var instruments = ["Additional Instruments:"];
		for(var i=0, j=checks.length; i<j; i++){
			if(checks[i].checked){
				instruments.push(checks[i].value);
			}
		}
		return instruments;
	}
	
	function controlToggle(x){
		switch(x){
			case "on":
				id("theForm").style.display = "none";
				id("clearDataLink").style.display = "inline";
				id("displayDataLink").style.display = "none";
				id("addAnother").style.display = "inline";
				break;
			case "off":
				id("theForm").style.display = "block";
				id("clearDataLink").style.display = "inline";
				id("displayDataLink").style.display = "inline";
				id("addAnother").style.display = "none";
				id("musicians").style.display = "none";
				break;
			default:
				return false;
		}
	
	}
	
	function saveData(key){
		if(!key){
			var randomID = Math.floor(Math.random()*100000); //Make new key
		}else{
			var randomID = key; //reuse previos key to overwrite for "edit"
		}
		
		//Compile form data into an object - properties include array with label and value.
		var entry		={};

		entry.fname		= ["First Name:", id("fname").value];
		entry.lname		= ["Last Name:", id("lname").value];
		entry.phone		= ["Phone:", id("phone").value];
		entry.email		= ["Email:", id("email").value];
		entry.primary	= ["Primary Instrument:", id("primary").value];
		entry.all		= getAllInstruments();
		entry.rating	= ["Rating:", id("rating").value];
		entry.lgig		= ["Last Gig:", id("lgig").value];
		entry.notes		= ["Notes:", id("notes").value];
		
		//Save into localStorage
		localStorage.setItem(randomID, JSON.stringify(entry));
		console.log(randomID + " " + JSON.stringify(entry));
		alert("Musician Data Saved");	
	};
	
	//Display Data
	function displayData(){
		if(localStorage.length === 0){
			alert("No musician data has been saved. Default data has been loaded.");
			loadDefaults();
			displayData();
		}else{
			controlToggle("on");
		}
		var newDiv = document.createElement("div");
		var oldDiv = id("musicians");
		document.body.replaceChild(newDiv,oldDiv)
		newDiv.setAttribute("id","musicians");
		newList =document.createElement("ul");
		newDiv.appendChild(newList);

		id("musicians").style.display = "block";
		for(i=0, j=localStorage.length; i<j; i++){
			var hr = document.createElement("hr");
			var newItem = document.createElement("li");
			var newLinksItem = document.createElement("li");
			newLinksItem.setAttribute("id", "buttons");
			newList.appendChild(hr);		
			newList.appendChild(newItem);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var data = JSON.parse(value);
			var newSubList = document.createElement("ul");
			newItem.appendChild(newSubList);
			
			displayImage(data.primary[1], newSubList);
			
			for(var n in data){
				var newSubItem = document.createElement("li");
				newSubList.appendChild(newSubItem);
				var subText = "";
				for(var x=0, y=data[n].length; x<y; x++){
					subText = subText + data[n][x] + " ";
				}
				newSubItem.innerHTML = subText;
				newSubList.appendChild(newLinksItem);
			}
			createItemLinks(key, newLinksItem); //Create links for each item
		}
	}
	
	//get the correct image for musicians primary instruments
	function displayImage(instrument, newSubList){
		var imageListItem = document.createElement("li");
		newSubList.appendChild(imageListItem);
		var newImage = document.createElement("img");
		newImage.setAttribute("src", "img/" + instrument + ".gif");
		imageListItem.appendChild(newImage);
	
	}
	
	//Will make the edit and delete options for each musician when displayed
	function createItemLinks(k, li){
		//add edit input item link
		var linkEdit = document.createElement("a");
		linkEdit.href = "#";	
		linkEdit.key = k;
		linkEdit.addEventListener("click", editMusician);
		linkEdit.innerHTML = "Edit";
		li.appendChild(linkEdit);

		//add delete item link
		var linkDelete = document.createElement("a");
		linkDelete.href = "#";	
		linkDelete.key = k;
		linkDelete.addEventListener("click", delMusician);
		linkDelete.innerHTML = "Delete";
		li.appendChild(linkDelete);
	}
	
	//Auto fill JASON to local storage
	function loadDefaults(){
		//This data comes from the json.js file referenced in the html file
		for(var m in json){
			var randomID = Math.floor(Math.random()*100000); //Make new key
		localStorage.setItem(randomID, JSON.stringify(json[m]));
		}
	}
	
	
	//Retrieve specific musician's data from local storage and it load back into the form
	function editMusician(){
		//Retrieve data from local storage
		var data = localStorage.getItem(this.key);
		var entry = JSON.parse(data);
		
		//Reveal form fields
		controlToggle("off");
		
		//Populate form fields
		id('fname').value = entry.fname[1];
		id('lname').value = entry.lname[1];	
		id('phone').value = entry.phone[1];
		id('email').value = entry.email[1];
		id('primary').value = entry.primary[1];
		checkAllInstruments(entry.all); //Fill Checkboxes
		id('rating').value = entry.rating[1];
		id('range').innerHTML = entry.rating[1]; //Display Range Property
		id('lgig').value = entry.lgig[1];
		id('notes').value = entry.notes[1];
		
		//NOTE: No longer any need to remove and replace listener, already triggers 'validate'
		//storeDataButton.removeEventListener("click", saveData); 
		//storeDataButton.addEventListener("click", validate);
		
		//Rename button
		storeDataButton.innerHTML = "Edit";
		storeDataButton.key = this.key; //Save key value to the 'save/edit' button
	}
	
	//Loop through array of checkbox values, inner loop through checkbox values to match
	function checkAllInstruments(instruments){
		var checks = document.forms[0].all;
		for(var i=1, j=instruments.length; i<j; i++){
			for(var x = 0, y=checks.length; x<y; x++){
				if(checks[x].value === instruments[i]){
					checks[x].setAttribute("checked", "checked");
				}
			} 
		}
	}
	
	//Delete specific musician data from storage
	function delMusician(){
		var check = confirm("Are you sure you want to delete this musician?");
		if(check){
			localStorage.removeItem(this.key);
			alert("Musician deleted.");
			window.location.reload();
			
		}else{
			alert("Musician was NOT deleted.");
		}
	}
	
	
	function validate(eData){	
		//Elements to check
		var fname = id('fname');
		var lname = id('lname');	
		var phone = id('phone');
		var email = id('email');
		var primary = id('primary');
		
		//Border styles
		var errBorder = "1px solid red";
		var regBorder = "1px solid black";
				
		//Clear any error old messages
		errorList.innerHTML = "";
		
		//Revert input borders to normal
		fname.style.border = regBorder;
		lname.style.border = regBorder;
		phone.style.border = regBorder;
		email.style.border = regBorder;
		primary.style.border = regBorder;		
		
		//Build error message
		var errMessage = [];

		//First name validation
		if(fname.value === ""){
			errMessage.push("Please enter a first name");
			fname.style.border = errBorder;
		}
		
		//Last name validation
		if(lname.value === ""){
			errMessage.push("Please enter a last name");
			lname.style.border = errBorder;
		}
		
		//Phone number validation
		if(! isPhoneFormat(phone.value)){
			errMessage.push("Please enter a phone in the proper format: XXX-XXX-XXXX");
			phone.style.border = errBorder;
		}
		
		//Email validation
		var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		
		if(!(reg.exec(email.value))){
			errMessage.push("Please enter a valid email address");
			email.style.border = errBorder;
		}
		
		//Primary instrument validation
		if(primary.value === " -Primary Instrument- "){
			errMessage.push("Please select primary instrument");
			primary.style.border = errBorder;
		}
		
		//If there are errors, display them
		if(errMessage.length >=1){
			for(var i=0, j=errMessage.length; i<j; i++){
				var li = document.createElement("li");
				li.innerHTML = errMessage[i];
				errorList.appendChild(li);
				//console.log(errMessage);
				//console.log(errMessage[i]);
								
			}
			eData.preventDefault();
			return false;	
		}else{
		//If no errors than save the data, incude key value to identify "edit"
			saveData(this.key);
		}
	}
	
	//Does a string follow a 123-456-7890 pattern like a phone number? (From SDI)
	function isPhoneFormat(str){
		var dash1 = str.substring(3,4);
		var dash2 = str.substring(7,8);	
		var num1 = str.substring(0,3);
		var num2 = str.substring(4,7);
		var num3 = str.substring(8,12);
		var result;
		
		if(str.length === 12 && dash1 === "-" && dash2 === "-"){ //Check length and hyphens..
			if (!isNaN(num1) && !isNaN(num2) && !isNaN(num3) ){ //Check for numeric data between hyphens..
				result = true;
			}else{
				result = false;
			}
		}else{
			result = false;
		}
		return result;
	}
	
	// Clear all data from local storage
	function clearData(){
		if(localStorage.length === 0){
			alert("No musician data has been saved.");
		}else{
			localStorage.clear();
			alert("All Musicians Deleted");
			window.location.reload();
			return false;
		}
	}
	
	
	// React to Rating Slider Change
	function newRange(){
		var range = id("range");
		range.innerHTML = this.value;
	}
	
	
	//Primary Instrument Values
	var pInstrument = [" -Primary Instrument- ","Guitar", "Bass", "Drums", "Keys", "Vocals", "Other"];
	var instruments;
	var errorList = id("errors");
	makePrimaryList();
	

	//Get Relevant Click Events
	var displayDataLink = id("displayDataLink");
	displayDataLink.addEventListener("click", displayData);
	
	var clearDataLink = id("clearDataLink");
	clearDataLink.addEventListener("click", clearData);

	var storeDataButton = id("submit");
	storeDataButton.addEventListener("click", validate);	
	
	//Get Rating Event
	var slider = id("rating");
	slider.addEventListener("change", newRange);	
	
});



