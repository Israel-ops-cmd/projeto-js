let tasks = [
    {id: 1, description: 'comprar pão', checked: false},
    {id: 2, description: 'Passear com o cachorro', checked: false},
    {id: 3, description: 'Fazer o almoço', checked: false}
]

const removeTask = (taskId) => {
    tasks = tasks.filter(({id}) => parseInt(id) != parseInt(taskId));
    document
        .getElementById('todo-list')
        .removeChild(document.getElementById(taskId))
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

const getCheckboxInput = ({id, description, checked}) => {
    const checkbox = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const checkboxId = `${id}-checkbox`;

    checkbox.type = 'checkbox';
    checkbox.id = checkboxId;
    checkbox.checked = checked || false;

    label.textContent = description;
    label.htmlFor = checkboxId;
    wrapper.className = 'checkbox-label-container';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);

    return wrapper;
}

const getNewTaskId = (event) => {
    const lastId = tasks[tasks.length - 1]?.id
    return lastId ? lastId + 1 : 1;
}

const getNewTaskData = (event) => {
    const description = event.target.elements.description.value;
    const id = getNewTaskId()
    return {description, id};
}

const createTask = (event) => {
    event.preventDefault();
    const newTaskData = getNewTaskData(event);
    const {id, description} = newTaskData;
    const checkbox = getCheckboxInput(newTaskData);
    creatTaskListItem(newTaskData, checkbox)
    tasks = [...tasks, {id: newTaskData.id, description: newTaskData.description, checked: false}]
}


window.onload = function() {
    const form = document.getElementById('creat-todo-form');
    form.addEventListener('submit', createTask)
    
    tasks.forEach((task) => {
        const checkbox = getCheckboxInput(task);
        creatTaskListItem(task, checkbox);
    })
} 
    