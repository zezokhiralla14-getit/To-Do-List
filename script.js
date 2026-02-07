document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');
    
    const handleButtonState = () => {
        const text = taskInput.value.trim();
        addTaskBtn.disabled = (text === "");
    };

    const showToast = (message) => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

    const refreshUI = (checkWin = true) => {
        const tasks = taskList.querySelectorAll('li');
        const completed = taskList.querySelectorAll('li.completed');
        
        emptyImage.style.display = tasks.length === 0 ? 'block' : 'none';
        emptyImage.style.animation = "fadeIn 1s ease forwards";

        const progress = tasks.length ? (completed.length / tasks.length) * 100 : 0;
        progressBar.style.width = `${progress}%`;
        progressNumbers.textContent = `${completed.length} / ${tasks.length}`;

        if(checkWin && tasks.length > 0 && completed.length === tasks.length) {
            Confetti();
        }
    };

    const saveToLocal = () => {
        const data = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        }));
        localStorage.setItem('myTasks', JSON.stringify(data));
    };

    const createTaskElement = (text, isCompleted = false) => {
        const li = document.createElement('li');
        if(isCompleted) li.classList.add('completed');

        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''}>
            <span>${text}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        // حدث الـ Checkbox
        li.querySelector('.checkbox').addEventListener('change', (e) => {
            li.classList.toggle('completed', e.target.checked);
            saveToLocal();
            refreshUI();
        });

        // حدث الحذف مع Animation
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.style.animation = "fadeOut 0.3s ease forwards";
            setTimeout(() => {
                li.remove();
                saveToLocal();
                refreshUI(false);
            }, 300);
        });

li.querySelector('.edit-btn').addEventListener('click', () => {

    if (li.classList.contains('completed')) {
        return;
    }

    const span = li.querySelector('span');
    const currentText = span.textContent;
    
    span.innerHTML = `<input type="text" class="edit-input" value="${currentText}">`;
    const editInput = span.querySelector('.edit-input');
    
    editInput.focus();

    const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText !== "") {
            span.textContent = newText;
        } else {
            span.textContent = currentText;
        }
        saveToLocal();
    };

    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });

    editInput.addEventListener('blur', saveEdit);
});

        taskList.appendChild(li);
    };

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault(); // منع الـ Refresh
        const text = taskInput.value.trim();
        if(text) {
            createTaskElement(text);
            taskInput.value = '';
            handleButtonState();
            saveToLocal();
            refreshUI();
            showToast("Task added successfully! ✨");
        }
    });

    taskInput.addEventListener('input', handleButtonState);

    const loadData = () => {
        const saved = JSON.parse(localStorage.getItem('myTasks')) || [];
        saved.forEach(t => createTaskElement(t.text, t.completed));
        refreshUI(false);
        handleButtonState();
    };
    loadData();
});


const Confetti = () => {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4772', '#ffffff', '#ffbf00']
    });
};

