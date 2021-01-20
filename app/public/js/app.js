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

function expandSex(value) {
	switch (value) {
		case 'M':
			return 'Male';
		case 'F':
			return 'Female';
		case 'O':
			return 'Other';
		default:
			return '-';
	}
}

// Refresh Students List
function refreshStudentsList () {
	var home = document.getElementById('home');
	var tableBody = home.querySelector('table tbody');

	tableBody.innerHTML = "";

	xhr = new XMLHttpRequest();
	xhr.open("GET", "api/listStudents");
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		showXHRResponseMsg(this, home);
		if (this.readyState == 4 && this.status == 200) {
			var studentsList = JSON.parse(this.responseText);

			var tableHTML = "";
			for (var i in studentsList) {
				tableHTML += 
					"<tr value=" + studentsList[i].ID + ">" +
					"<td>" + studentsList[i].ID + "</td>" +
					"<td>" + studentsList[i].FIRST_NAME + " " +
						studentsList[i].LAST_NAME + "</td>" +
					"<td>" + expandSex(studentsList[i].SEX) + "</td>" +
					"<td>" + (studentsList[i].MARKS_O == null ? '-' : studentsList[i].MARKS_O) +
						"/" + (studentsList[i].MARKS_O == null ? '-' : studentsList[i].MARKS_T) +
						"</td>" +
					"<td><button name=\"view\" value=" + studentsList[i].ID +
						" class=\"btn btn-primary btn-sm m-1\">View</button>" + 
						"<button name=\"delete\" value=" + studentsList[i].ID +
						" class=\"btn btn-danger btn-sm m-1\">Delete</button></td>" +
					"</tr>";
			}
			tableBody.innerHTML = tableHTML;

			// On click view details of student
			tableBody.querySelectorAll('[name=view').forEach(function (viewID) {
				viewID.addEventListener('click', function() {
					xhr = new XMLHttpRequest();
					xhr.open("POST", "api/viewStudent");
					xhr.setRequestHeader("Content-type", "application/json");
					xhr.onreadystatechange = function () {
						if (this.readyState == 4) {
							if (this.status == 200) {
								var student = JSON.parse(this.responseText)[0];
								console.log(student);

								tableHTML = "";
								tableHTML +=
									"<tr><td>ID</td><td>" + student.ID + "</td></tr>" +
									"<tr><td>First Name</td><td>" + student.FIRST_NAME + "</td></tr>" +
									"<tr><td>Last Name</td><td>" + student.LAST_NAME + "</td></tr>" +
									"<tr><td>Sex</td><td>" + expandSex(student.SEX) + "</td></tr>" +
									"<tr><td>Date Of Birth</td><td>" + (student.DOB).split('T')[0] + "</td></tr>" +
									"<tr><td>Address</td><td>" + student.ADDRESS + ", " + student.CITY + ", " +
										student.STATE + " - " + student.PIN_CODE + "</td></tr>" +
									"<tr><td>Marks</td><td>" + (student.MARKS_O == null ? '-' : student.MARKS_O) +
										"/" + (student.MARKS_O == null ? '-' : student.MARKS_T) + "</td></tr>";

								var studentModal = document.querySelector('#home .modal');
								studentModal.querySelector('.table').innerHTML = tableHTML;

								(new bootstrap.Modal(studentModal)).show();
							} else {
								console.log(this.responseText);
								alert("Error retrieving details for ID = " + viewID.value + " : " + this.responseText);
							}
						}
					};

					xhr.send(JSON.stringify({ id: viewID.value }));
				});
			});

			// On click delete student
			tableBody.querySelectorAll('[name=delete]').forEach(function (deleteID) {
				deleteID.addEventListener('click', function() {
					var sure = confirm("Are you sure, you want to delete student with ID = " + deleteID.value + "?");
					if (sure) {
						xhr = new XMLHttpRequest();
						xhr.open("POST", "api/deleteStudent");
						xhr.setRequestHeader("Content-type", "application/json");
						xhr.onreadystatechange = function() {
							if (this.readyState == 4) {
								if (this.status == 200) {
									alert("Student with ID = " + deleteID.value + " deleted!");
									refreshStudentsList();
								} else {
									console.log(this.responseText);
									alert("Error deleting ID = " + deleteID.value + " : " + this.responseText);
								}
							}
						};

						xhr.send(JSON.stringify({ id: deleteID.value }));
					}
				});
			});
		}
	};

	showXHRSendingMsg(home);
	xhr.send();
}

// Onload
window.addEventListener('load', refreshStudentsList);

// On click refresh
document.querySelector('#home .refresh').addEventListener('click', refreshStudentsList);

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
			addMarksForm.querySelector('[name=sex]').value = expandSex(student[0].SEX);

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
