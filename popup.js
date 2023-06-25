document.addEventListener('DOMContentLoaded', function () {
  const taskList = document.getElementById('task-list');
  const taskInput = document.getElementById('task-input');
  const addButton = document.getElementById('add-button');

  // Load tasks from local storage
  chrome.storage.local.get(['tasks'], function (result) {
    if (result.tasks) {
      const tasks = JSON.parse(result.tasks);
      tasks.forEach((task) => addTaskElement(task));
    }
  });

  // Add task when add button is clicked
  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      const task = { id: Date.now(), text: taskText };
      addTaskElement(task);
      saveTasksToStorage();
      taskInput.value = '';
    }
  }

  addButton.addEventListener('click', addTask);

  taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  // Add task element to the list
  function addTaskElement(task) {
    const li = document.createElement('li');
    li.dataset.id = task.id; // Set the 'id' attribute of the <li> element
  
    const taskText = document.createElement('span');
    taskText.textContent = task.text;
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function () {
      li.remove();
      saveTasksToStorage();
    });
  
    li.appendChild(taskText);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  }
  

  // Save tasks to local storage
  function saveTasksToStorage() {
    const tasks = Array.from(taskList.children).map((li) => ({
      id: li.dataset.id, // Retrieve the 'id' attribute of the <li> element
      text: li.querySelector('span').textContent, // Get the task text from the <span> element
    }));
    chrome.storage.local.set({ tasks: JSON.stringify(tasks) });
  }

  function countTasksInStorage(callback) {
    chrome.storage.local.get('tasks', function(result) {
      if (chrome.runtime.lastError) {
        // Handle error if any
        console.error(chrome.runtime.lastError);
        callback(0); // Return 0 tasks
        return;
      }
      
      const tasksString = result.tasks;
      if (tasksString) {
        try {
          const tasks = JSON.parse(tasksString);
          const taskCount = tasks.length;
          callback(taskCount);
        } catch (error) {
          console.error('Error parsing tasks from local storage:', error);
          callback(0); // Return 0 tasks
        }
      } else {
        callback(0); // Return 0 tasks
      }
    });
  }
  
  countTasksInStorage(function(taskCount) {
  console.log('Number of tasks in local storage:', taskCount);
  // Do something with the task count
});

  
});


