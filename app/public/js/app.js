// Show Form XHR Sending Message
function showXHRSendingMsg(form) {
	var activeXHRState = form.querySelector('.xhr-state .active');
	if (activeXHRState) {
		activeXHRState.classList.remove('active');
	}
	form.querySelector('.xhr-state .xhr-loading').classList.add('active');
}

// Show Form XHR Response Message
function showXHRResponseMsg(xhr, form) {
	if (xhr.readyState == 4) {
		var activeXHRState = form.querySelector('.xhr-state .active');
		if (xhr.status == 200) {
			if (activeXHRState) {
				activeXHRState.classList.remove('active');
			}
			var successXHRState = form.querySelector('.xhr-state .xhr-success');
			successXHRState.classList.add('active');
			successXHRState.querySelector('.res-msg').innerHTML = xhr.responseText;
		} else {
			if (activeXHRState) {
				activeXHRState.classList.remove('active');
			}
			var failXHRState = form.querySelector('.xhr-state .xhr-fail');
			failXHRState.classList.add('active');
			failXHRState.querySelector('.res-msg').innerHTML = xhr.responseText;
		}
	}
}

// Form Submit: Add Student
document.querySelector('.add-student form').addEventListener('submit', function (ev) {
	var form = document.querySelector('.add-student form');
	var formData = new FormData(form);

	var studentData = {};
	formData.forEach(function (value, key) {
		studentData[key] = value;
	});

	xhr = new XMLHttpRequest();
	xhr.open("POST", "api/addStudent");
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function() {
		showXHRResponseMsg(this, form);
	};

	showXHRSendingMsg(form);
	console.log('Sending ' + JSON.stringify(studentData));
	xhr.send(JSON.stringify(studentData));

	ev.preventDefault();
});
