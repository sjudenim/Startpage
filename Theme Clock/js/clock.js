var Clock = {
	updateClock: function() {
		var now = new Date();
		document.getElementById('hours').innerHTML = ((now.getHours()<10)?'0':'') + now.getHours();
		document.getElementById('minutes').innerHTML = ((now.getMinutes()<10)?'0':'') + now.getMinutes();
		document.getElementById('seconds').innerHTML = ((now.getSeconds()<10)?'0':'')  + now.getSeconds();
	},
	
	init: function() {
		setInterval(Clock.updateClock,1000);
	}	
}

Clock.init();

let d = new Date();
let month = d.getMonth();
let monthArr = ["01", "02","03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
let date = d.getDate();
let year = d.getFullYear().toString().substr(2, 2);

month = monthArr[month];

document.getElementById("month").innerHTML = month; 
document.getElementById("date").innerHTML = (date < 10 ? '0' : '') + d.getDate();
document.getElementById("year").innerHTML = year;

function save(){
    var checkbox = document.getElementById('themeswitch');
    localStorage.setItem('themeswitch', checkbox.checked);
}

function load(){    
    var checked = JSON.parse(localStorage.getItem('themeswitch'));
    document.getElementById("themeswitch").checked = checked;
}

load();