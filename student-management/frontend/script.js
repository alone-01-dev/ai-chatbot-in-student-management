let editingStudentId = null;
function showMessage(message, type) {

    const messageDiv = document.getElementById("message");

    messageDiv.innerHTML = `
        <div class="alert alert-${type}" role="alert">
            ${message}
        </div>
    `;

    setTimeout(() => {
        messageDiv.innerHTML = "";
    }, 3000);
}
document.getElementById("studentForm").addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const age = document.getElementById("age").value;
    const department = document.getElementById("department").value;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Age:", age);
    console.log("Department:", department);

    const student = {
        name: name,
        email: email,
        age: age,
        department: department
    };

    const url = editingStudentId
        ? `http://localhost:8081/api/students/${editingStudentId}`
        : "http://localhost:8081/api/students";

    const method = editingStudentId ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(student)
    })
    .then(async response => {

    const data = await response.json();

    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }

    return data;

})
        .then(data => {
            console.log("Student saved:", data);
             if (editingStudentId) {
        showMessage("Student updated successfully!", "success");
    } else {
        showMessage("Student created successfully!", "success");
    }
            

            editingStudentId = null;
            
            document.getElementById("searchInput").value = "";

            loadStudents();

            document.getElementById("studentForm").reset();
            document.getElementById("submitButton").textContent = "Add Student";
            document.getElementById("cancelButton").style.display = "none";
        })
        .catch(error => {
            console.error("Error adding student:", error);
              try {

        const errors = JSON.parse(error.message);

        const messages = Object.values(errors);

        showMessage(messages.join("<br>"), "danger");

    } catch (e) {

        showMessage("Something went wrong. Please try again.", "danger");

    }

        });

});


function loadStudents() {

    console.log("Loading students...");

    fetch("http://localhost:8081/api/students")
        .then(response => response.json())
        .then(data => {

            console.log("Students:", data);

            const students = data.data;

            const tableBody = document.getElementById("studentTableBody");
            tableBody.innerHTML = "";
            students.forEach(student => {

                const row = `
    <tr>
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.age}</td>
        <td>${student.department}</td>
        <td>
    <button class="btn btn-warning btn-sm"
            onclick="editStudent(${student.id})">
        Edit
    </button>

    <button class="btn btn-danger btn-sm"
            onclick="deleteStudent(${student.id})">
        Delete
    </button>
</td>
    </tr>
`;

                tableBody.innerHTML += row;

            });

        })
        .catch(error => {

            console.error("Error loading students:", error);

        });
}

loadStudents();

function deleteStudent(id) {
    const confirmed = confirm("Are you sure you want to delete this student?");

if (!confirmed) {
    return;
}

    fetch(`http://localhost:8081/api/students/${id}`, {
        method: "DELETE"
    })
        .then(response => response.json())
        .then(data => {

            console.log("Student deleted:", data);
            showMessage("Student deleted successfully!", "success");
            loadStudents();
        })
        .catch(error => {

            console.error("Error deleting student:", error);

        });
}
function editStudent(id) {
    editingStudentId = id;
       
    document.getElementById("submitButton").textContent = "Update Student";
    document.getElementById("cancelButton").style.display = "inline-block";
    fetch(`http://localhost:8081/api/students/${id}`)
        .then(response => response.json())
        .then(data => {

            console.log("Student to edit:", data);
         
            const student = data.data;

            document.getElementById("name").value = student.name;
            document.getElementById("email").value = student.email;
            document.getElementById("age").value = student.age;
            document.getElementById("department").value = student.department;
            

        })
        .catch(error => {
            console.error("Error getting student:", error);
        });
}
document.getElementById("cancelButton").addEventListener("click", function() {

    editingStudentId = null;

    document.getElementById("studentForm").reset();

    document.getElementById("submitButton").textContent = "Add Student";

    document.getElementById("cancelButton").style.display = "none";

});

document.getElementById("searchButton").addEventListener("click", function () {

    const searchText = document.getElementById("searchInput").value.trim();
    if(searchText===""){
        loadStudents();
        return;
    }
    const encodedName = encodeURIComponent(searchText);
    fetch(`http://localhost:8081/api/students/search?name=${encodedName}`)
        .then(response => response.json())
        .then(data => {

            console.log("Search results:", data);

            const students = data.data;

            const tableBody = document.getElementById("studentTableBody");

            tableBody.innerHTML = "";
            if (students.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center">
                No students found.
            </td>
        </tr>
    `;

    return;
}

            students.forEach(student => {

                const row = `
                    <tr>
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.age}</td>
                        <td>${student.department}</td>
                        <td>
                            <button class="btn btn-warning btn-sm"
                                    onclick="editStudent(${student.id})">
                                Edit
                            </button>

                            <button class="btn btn-danger btn-sm"
                                    onclick="deleteStudent(${student.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `;

                tableBody.innerHTML += row;
            });

        })
        .catch(error => {

            console.error("Error searching students:", error);

        });

});
document.getElementById("searchInput").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        document.getElementById("searchButton").click();

    }

});

document.getElementById("showAllButton").addEventListener("click", function () {

    document.getElementById("searchInput").value = "";

    loadStudents();

});