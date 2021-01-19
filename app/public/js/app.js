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
			if (successXHRState) {
				successXHRState.classList.add('active');
				successXHRState.querySelector('.res-msg').innerHTML = xhr.responseText;
			}
		} else {
			if (activeXHRState) {
				activeXHRState.classList.remove('active');
			}
			var failXHRState = form.querySelector('.xhr-state .xhr-fail');
			if (failXHRState) {
				failXHRState.classList.add('active');
				failXHRState.querySelector('.res-msg').innerHTML = xhr.responseText;
			}
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

// Form Submit: Add Marks Search
document.querySelector('.add-marks-search').addEventListener('submit', function (ev) {
	var form = document.querySelector('.add-marks-search');

	xhr = new XMLHttpRequest();
	xhr.open("POST", "api/addMarksSearch");
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function() {
		showXHRResponseMsg(this, form);

		var addMarksForm = document.querySelector('.add-marks-form');
		if (this.readyState == 4 && this.status == 200) {
			var student = JSON.parse(this.responseText);

			addMarksForm.querySelector('[name=firstName]').value = student[0].FIRST_NAME;
			addMarksForm.querySelector('[name=lastName]').value = student[0].LAST_NAME;
			addMarksForm.querySelector('[name=sex]').value = (function () {
				switch (student[0].SEX) {
					case 'M':
						return 'Male';
					case 'F':
						return 'Female';
					case 'O':
						return 'Other';
					default:
						return '-';
				}
			})();

			// Form Submit: Add Marks Form
			addMarksForm.addEventListener('submit', function (ev) {
				xhr = new XMLHttpRequest();
				xhr.open("POST", "api/addMarksForm");
				xhr.setRequestHeader("Content-type", "application/json");
				xhr.onreadystatechange = function() {
					showXHRResponseMsg(this, addMarksForm);
				};

				showXHRSendingMsg(addMarksForm);
				xhr.send(JSON.stringify({
					id: form.id.value,
					marksO: addMarksForm.marksObtained.value,
					marksT: addMarksForm.marksTotal.value
				}));

				ev.preventDefault();
			});

			addMarksForm.classList.remove('hidden');
		} else {
			addMarksForm.classList.add('hidden');
		}
	};

	showXHRSendingMsg(form);
	console.log('Sending ' + JSON.stringify({ id: form.id.value }));
	xhr.send(JSON.stringify({ id: form.id.value }));

	ev.preventDefault();
});
