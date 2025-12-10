// script.js

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskCounter = document.getElementById("taskCounter");
const errorFeedback = document.getElementById("errorFeedback");

// State Array: The single source of truth for all tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// --- Persistence ---

// Saves the state array to localStorage
function saveState() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// --- Modularity: Element Creation ---

function createTaskElement(task, index) {
    const li = document.createElement("li");
    
    // Set text and setup A11y attributes
    li.textContent = task.text;
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0'); // Make it focusable

    if (task.completed) {
        li.classList.add("completed");
        li.setAttribute('aria-checked', 'true'); // A11y status
    } else {
        li.setAttribute('aria-checked', 'false'); // A11y status
    }

    // Toggle Completion Handler
    const toggleTask = () => {
        tasks[index].completed = !tasks[index].completed; // Update state
        renderTasks(); // Re-render the UI
        saveState(); // Save the updated state
    };

    li.addEventListener("click", toggleTask);
    
    // Handle keyboard interaction for toggle (Space/Enter key)
    li.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTask();
        }
    });

    // Delete Button setup
    let deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Use trash icon
    deleteBtn.classList.add("btn-delete");
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.text}`); // A11y label

    // Delete Handler
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the li click handler from running
        
        tasks.splice(index, 1); // Remove from state
        renderTasks(); // Re-render the UI
        saveState(); // Save the updated state
    });

    li.appendChild(deleteBtn);
    return li;
}


// --- Rendering ---

// Renders the UI based *only* on the current state array
function renderTasks() {
    taskList.innerHTML = ''; // Clear existing UI

    tasks.forEach((task, index) => {
        // Use the modular factory function
        const li = createTaskElement(task, index); 
        taskList.appendChild(li);
    });
    
    // Update Task Counter (Enhanced User Feedback)
    const incompleteCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = `${incompleteCount} ${incompleteCount === 1 ? 'task' : 'tasks'} remaining`;
}

// --- Main Action ---

function addTask() {
    const taskText = taskInput.value.trim();
    
    // Reset error message display
    errorFeedback.classList.remove('show');

    if (taskText === "") {
        // Inline Error Feedback
        errorFeedback.textContent = "Task description cannot be empty.";
        errorFeedback.classList.add('show');
        taskInput.focus();
        return;
    }

    // 1. Update State
    tasks.push({ text: taskText, completed: false });
    
    // 2. Update UI and Storage
    renderTasks(); 
    saveState(); 

    // Reset input and focus
    taskInput.value = "";
    taskInput.focus(); 
}

// --- Event Listeners ---

// Add button click handler
addTaskBtn.addEventListener("click", addTask);

// Allow adding task with 'Enter' key
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Initial load: Render tasks when the page is ready
document.addEventListener("DOMContentLoaded", renderTasks);
