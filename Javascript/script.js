// Get HTML elements using DOM methods
const employeeForm = document.getElementById("employeeForm");
const empId = document.getElementById("empId");
const empName = document.getElementById("empName");
const empEmail = document.getElementById("empEmail");
const empDepartment = document.getElementById("empDepartment");
const empSalary = document.getElementById("empSalary");

const employeeTableBody = document.getElementById("employeeTableBody");
const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");

const employeeCount = document.getElementById("employeeCount");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const editIndex = document.getElementById("editIndex");
const formTitle = document.getElementById("formTitle");

// Array to store employee records

let employees = [];

// Add or Update Employee

employeeForm.addEventListener("submit", function (event) {
    // Prevent page reload
    event.preventDefault();

    const id = empId.value.trim();
    const name = empName.value.trim();
    const email = empEmail.value.trim();
    const department = empDepartment.value;
    const salary = Number(empSalary.value);

    // Validate fields
    if (!id || !name || !email || !department ||
        empSalary.value.trim() === "" ||
        !Number.isFinite(salary) || salary <= 0) {

        alert("Please enter valid employee details.");
        return;
    }

    // Check for duplicate employee ID
    const existingEmployee = employees.findIndex(function (employee) {
        return employee.id.toLowerCase() === id.toLowerCase();
    });

    const currentIndex = editIndex.value === ""
        ? -1
        : Number(editIndex.value);

    if (existingEmployee !== -1 &&
        existingEmployee !== currentIndex) {

        alert("Employee ID already exists!");
        return;
    }

    // Create employee object
    const employee = {
        id: id,
        name: name,
        email: email,
        department: department,
        salary: salary
    };

    // Update existing employee
    if (currentIndex !== -1) {

        employees[currentIndex] = employee;
        alert("Employee updated successfully!");

    } else {
        // Add new employee
        employees.push(employee);

        alert("Employee added successfully!");
    }

    // Reset form and refresh table
    employeeForm.reset();
    resetEditMode();
    displayEmployees();

});

// Display Employees
function displayEmployees() {

    // Clear previous table rows
    employeeTableBody.innerHTML = "";

    const searchText = searchInput.value.trim().toLowerCase();
    const selectedDepartment = departmentFilter.value;

    // Search and filter employees
    const filteredEmployees = employees.filter(function (employee) {

        const matchesSearch =
            employee.id.toLowerCase().includes(searchText) ||
            employee.name.toLowerCase().includes(searchText);

        const matchesDepartment =
            selectedDepartment === "" ||
            employee.department === selectedDepartment;

        return matchesSearch && matchesDepartment;

    });

    // Update employee count
    employeeCount.textContent =
        "Showing " + filteredEmployees.length +
        " of " + employees.length + " Employees";

    // Display empty message
    if (filteredEmployees.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 6;
        cell.className = "empty-message";
        cell.textContent = "No employees found.";

        row.appendChild(cell);
        employeeTableBody.appendChild(row);

        return;
    }

    // Create table rows dynamically
    filteredEmployees.forEach(function (employee) {

        const row = document.createElement("tr");

        // Create cells
        const idCell = document.createElement("td");
        idCell.textContent = employee.id;

        const nameCell = document.createElement("td");
        nameCell.textContent = employee.name;

        const emailCell = document.createElement("td");
        emailCell.textContent = employee.email;

        const departmentCell = document.createElement("td");
        departmentCell.textContent = employee.department;

        const salaryCell = document.createElement("td");
        salaryCell.textContent = employee.salary.toLocaleString(
            "en-IN",
            {
                style: "currency",
                currency: "INR"
            }
        );

        // Create action buttons
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function () {
            editEmployee(employee.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteEmployee(employee.id);
        });

        // Add buttons to action cell
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Add cells to row
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(departmentCell);
        row.appendChild(salaryCell);
        row.appendChild(actionCell);

        // Add row to table
        employeeTableBody.appendChild(row);

    });
}

// Search Employees
searchInput.addEventListener("input", function () {
    displayEmployees();
});

// Filter Employees by Department
departmentFilter.addEventListener("change", function () {
    displayEmployees();
});

// Edit Employee
function editEmployee(id) {
    const index = employees.findIndex(function (employee) {
        return employee.id === id;
    });

    if (index === -1) {
        return;
    }

    const employee = employees[index];

    // Fill form with existing data
    empId.value = employee.id;
    empName.value = employee.name;
    empEmail.value = employee.email;
    empDepartment.value = employee.department;
    empSalary.value = employee.salary;

    // Store index of employee being edited
    editIndex.value = index;

    formTitle.textContent = "Update Employee";
    submitBtn.textContent = "Update Employee";
    cancelBtn.hidden = false;

    // Scroll to form
    employeeForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Delete Employee
function deleteEmployee(id) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
        return;
    }

    employees = employees.filter(function (employee) {
        return employee.id !== id;
    });

    resetEditMode();
    employeeForm.reset();

    displayEmployees();

    alert("Employee deleted successfully!");

}

// Reset Edit Mode
function resetEditMode() {

    editIndex.value = "";

    formTitle.textContent = "Add New Employee";
    submitBtn.textContent = "Add Employee";
    cancelBtn.hidden = true;

}

// Cancel Editing
cancelBtn.addEventListener("click", function () {

    employeeForm.reset();
    resetEditMode();

});

// Initial Display
displayEmployees();