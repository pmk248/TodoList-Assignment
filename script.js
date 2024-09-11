document.addEventListener("DOMContentLoaded", () => { refreshTable(); });

const todos = JSON.parse(localStorage.getItem('allTasks')) || [];
const newTodoForm = document.getElementById('taskForm');
const tableBody = document.querySelector('tbody');
const filterButton = document.getElementById('filterCompletedButton');

//--------- Functions ---------//
function findById(id){
    const index = todos.findIndex(t => t.Id === id);
    return todos[index];
};

function generateId(){
    return `a`+ Math.random().toString(36).substring(2, 15);
};

function updateTodos(){
    localStorage.setItem('allTasks', JSON.stringify(todos));
};

function addTask(renderedTask){
    todos.push(renderedTask);
    updateTodos();
    refreshTable(todos);
};

function refreshTable(pendingTasks = todos) {

    tableBody.innerHTML = '';

    pendingTasks.forEach(task =>{

        const newRow = document.createElement('tr');
        newRow.setAttribute('id', task.Id);

        let rowData = {
            Id: `${task.Id.substr(0, 3)}...`,
            Name: task.Name,
            Status: task.Status
        };
        for (let key in rowData) {

            const newData = document.createElement('td');
            newData.innerText = rowData[key];
            newRow.appendChild(newData);
        };
        newRow.appendChild(addButtons(task));
        tableBody.appendChild(newRow);
    });
}

function addButtons(task) {
    let actionData = document.createElement('td');

    // "Mark as Completed"/"Undo" button
    const toggleButton = document.createElement('button');
    toggleButton.innerText = task.Status ? 'Undo Completion' : 'Mark as Completed';
    toggleButton.style.backgroundColor = task.Status ? '#4CAF50' : '#FF9800';
    toggleButton.onclick = () => toggleCompletion(task.Id);

    // "Edit" button
    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.style.backgroundColor = '#2196F3';
    editButton.onclick = () => openEditPopup(task.Id);

    // "Delete" button
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.style.backgroundColor = '#f44336';
    deleteButton.onclick = () => removeTask(task.Id);

    actionData.appendChild(toggleButton);
    actionData.appendChild(editButton);
    actionData.appendChild(deleteButton);

    return actionData;
};

function toggleCompletion(id){
    let task = findById(id);
    task.Status = !task.Status;

    updateTodos();
    refreshTable();
    
};

function removeTask(id) {
    let index = todos.findIndex(t => t.Id === id);
    todos.splice(index, 1);
    updateTodos();
    refreshTable();
};

// consts for edit popup elements
const editInput = document.getElementById('editInput');  
const saveEditButton = document.getElementById('saveEditButton');  
const cancelEditButton = document.getElementById('cancelEditButton'); 

// Hold element id currently being editted
let currentEdit = null;
// Hold bool value to check if list is currently filtered:
let isFiltered = false;

function openEditPopup(id){
    let task = findById(id);
    currentEdit = id; 
    editInput.value = task.Name;
    document.querySelector('.popup').style.display = 'block';
};

function closeEditPopup(){
    document.querySelector('.popup').style.display = 'none';
    editInput.value = "";
}

//--------- Event Listeners --------- //

newTodoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let inputField = event.target.elements.taskName;
    let userImput = inputField.value.trim();
    if (!userImput){
        alert("Please enter a valid task name");
        return;
    }

    let renderedTask = {
        Id: generateId(),
        Name: userImput,
        Status: false
    };
    addTask(renderedTask);
    inputField.value = "";
});

saveEditButton.addEventListener("click", () => {
    const task = findById(currentEdit);
    task.Name = editInput.value.trim();
    updateTodos();
    refreshTable();
    closeEditPopup();
});

cancelEditButton.addEventListener("click", () => {
    closeEditPopup();
});

filterButton.addEventListener("click", () => {
    let filteredList = todos.filter(t => t.Status === true);
    if (isFiltered){
        refreshTable();    
    } else {
        refreshTable(filteredList);
    }
    isFiltered = !isFiltered;
});