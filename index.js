let tasks = [
    {id: 1, description: 'comprar pão', checked: false},
    {id: 2, description: 'Passear com o cachorro', checked: false},
    {id: 3, description: 'Fazer o almoço', checked: false}
]

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'));
    return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

const removeTask = (taskId) => {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.filter(({id}) => parseInt(id) !== parseInt(taskId));
    setTasksInLocalStorage(updatedTasks);
    document
        .getElementById('todo-list')
        .removeChild(document.getElementById(taskId))
    
    updateTaskCounter();
}

const removeDoneTasks = () => {
    const tasks = getTasksFromLocalStorage();
    const tasksToRemove = tasks
    .filter(({checked}) => checked)
    .map(({id}) => id)
    
    const updatedTasks = tasks.filter(({checked}) => !checked);
    setTasksInLocalStorage(updatedTasks);

    tasksToRemove.forEach((tasksToRemove) => {
        document
            .getElementById("todo-list")
            .removeChild(document.getElementById(tasksToRemove))
    })
    updateTaskCounter();
}

const creatTaskListItem = (task, checkbox) => {
    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');

    const removeTaskButton = document.createElement('button');
    removeTaskButton.textContent = 'x';
    removeTaskButton.ariaLabel = 'Remover Tarefa'
    removeTaskButton.onclick = () => removeTask(task.id);

    toDo.id = task.id;
    toDo.appendChild(checkbox);
    toDo.appendChild(removeTaskButton);
    list.appendChild(toDo);

    return toDo;
}

const onCheckboxClick = (event) => {
    const id = event.target.id.split('-')[0];
    const  tasks = getTasksFromLocalStorage();

    const updatedTasks = tasks.map((task) => {
        return parseInt(task.id) == parseInt(id)
            ? {...task, checked: event.target.checked}
            : task
})

setTasksInLocalStorage(updatedTasks);
updateTaskCounter();
}

const getCheckboxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;
    checkbox.addEventListener('change', onCheckboxClick);

    label.textContent = description;
    label.htmlFor = checkboxId;
    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
}

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId()
    return {description, id};
}

const getCreatedTaskInfo = (event) => new Promise((resolve) => {
    setTimeout(() => {
        resolve(getNewTaskData(event))
    }, 3000)
})

const createTask = async (event) => {
    event.preventDefault();
    document.getElementById('save-task').setAttribute('disabled', true);
    const newTaskData = await getCreatedTaskInfo(event);
    const {id, description} = newTaskData;
    const checkbox = getCheckboxInput(newTaskData);
    creatTaskListItem(newTaskData, checkbox);

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [...tasks, {id: newTaskData.id, description: newTaskData.description, checked: false}]
    setTasksInLocalStorage(updatedTasks);
    document.getElementById('description').value = '';
    document.getElementById('save-task').removeAttribute('disabled');

    updateTaskCounter();

}


window.onload = function() {
    const form = document.getElementById('creat-todo-form');
    form.addEventListener('submit', createTask);

    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        creatTaskListItem(task, checkbox);
    })
    updateTaskCounter();
} 

const updateTaskCounter = () => {
    const tasks = getTasksFromLocalStorage(); // Pegamos as tarefas do localStorage
    const totalTasks = tasks.length; // Quantidade total de tarefas
    const completedTasks = tasks.filter(task => task.checked).length; // Quantidade de tarefas concluídas

    // Atualiza o texto do contador
    document.getElementById('task-counter').textContent = `${completedTasks}/${totalTasks} tarefas concluídas`;
};

    