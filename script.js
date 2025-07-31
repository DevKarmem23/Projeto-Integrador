// Funções auxiliares
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function getLoggedUser() {
    const email = localStorage.getItem('loggedInUser');
    if (!email) return null;
    const users = getUsers();
    return users.find(u => u.email === email);
}
function setLoggedUser(email) {
    localStorage.setItem('loggedInUser', email);
}
function logoutUser() {
    localStorage.removeItem('loggedInUser');
}

// Controle de telas
const screens = {
    login: document.getElementById('login-section'),
    register: document.getElementById('register-section'),
    list: document.getElementById('list-section'),
    edit: document.getElementById('edit-section')
};
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
}

// Login
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const users = getUsers();
    const user = users.find(u => u.email === email && u.senha === password);
    if (user) {
        setLoggedUser(email);
        loginError.textContent = '';
        loadPeopleList();
        showScreen('list');
    } else {
        loginError.textContent = 'Email ou senha inválidos.';
    }
});
document.getElementById('link-to-register').addEventListener('click', e => {
    e.preventDefault();
    showScreen('register');
});
document.getElementById('link-to-login').addEventListener('click', e => {
    e.preventDefault();
    showScreen('login');
});

// Registro
const registerForm = document.getElementById('register-form');
const registerError = document.getElementById('register-error');
registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('reg-nome').value.trim();
    const cpf = document.getElementById('reg-cpf').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const telefone = document.getElementById('reg-telefone').value.trim();
    const nascimento = document.getElementById('reg-nascimento').value;
    const senha = document.getElementById('reg-senha').value;
    const users = getUsers();

    if (users.find(u => u.email === email)) {
        registerError.textContent = 'Email já cadastrado.';
        return;
    }
    if (users.find(u => u.cpf === cpf)) {
        registerError.textContent = 'CPF já cadastrado.';
        return;
    }
    // Validar cpf simples (11 dígitos)
    if (!/^\d{11}$/.test(cpf)) {
        registerError.textContent = 'CPF inválido. Deve conter 11 dígitos numéricos.';
        return;
    }

    users.push({ id: Date.now(), nome, cpf, email, telefone, nascimento, senha });
    setUsers(users);
    registerError.textContent = '';
    alert('Cadastro realizado com sucesso! Faça login.');
    registerForm.reset();
    showScreen('login');
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
    logoutUser();
    showScreen('login');
});

// Listagem
const peopleTableBody = document.querySelector('#people-table tbody');
function loadPeopleList() {
    const users = getUsers();
    peopleTableBody.innerHTML = '';
    users.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.cpf}</td>
            <td>${user.email}</td>
            <td>${user.telefone}</td>
            <td>${user.nascimento}</td>
            <td>
                <button class="edit-btn" data-id="${user.id}">Editar</button>
                <button class="delete-btn" data-id="${user.id}">Excluir</button>
            </td>`;
        peopleTableBody.appendChild(tr);
    });
    // Adicionar eventos nos botões
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-id'));
            startEditPerson(id);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.getAttribute('data-id'));
            deletePerson(id);
        });
    });
}

// Botão adicionar novo (abre formulário cadastro)
document.getElementById('btn-add-new').addEventListener('click', () => {
    registerForm.reset();
    registerError.textContent = '';
    showScreen('register');
});

// Editar pessoa
const editForm = document.getElementById('edit-form');
function startEditPerson(id) {
    const users = getUsers();
    const user = users.find(u => u.id === id);
    if (!user) return alert('Usuário não encontrado');
    document.getElementById('edit-id').value = user.id;
    document.getElementById('edit-nome').value = user.nome;
    document.getElementById('edit-cpf').value = user.cpf;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-telefone').value = user.telefone;
    document.getElementById('edit-nascimento').value = user.nascimento;
    showScreen('edit');
}
editForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = Number(document.getElementById('edit-id').value);
    const nome = document.getElementById('edit-nome').value.trim();
    const cpf = document.getElementById('edit-cpf').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const telefone = document.getElementById('edit-telefone').value.trim();
    const nascimento = document.getElementById('edit-nascimento').value;
    const users = getUsers();

    // Verifica se CPF ou email está duplicado para outro usuário
    if (users.some(u => u.id !== id && u.cpf === cpf)) {
        alert('CPF já está cadastrado para outro usuário.');
        return;
    }
    if (users.some(u => u.id !== id && u.email === email)) {
        alert('Email já está cadastrado para outro usuário.');
        return;
    }

    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        alert('Usuário não encontrado');
        return;
    }
    users[index].nome = nome;
    users[index].cpf = cpf;
    users[index].email = email;
    users[index].telefone = telefone;
    users[index].nascimento = nascimento;
    setUsers(users);
    alert('Usuário atualizado com sucesso!');
    loadPeopleList();
    showScreen('list');
});
document.getElementById('btn-cancel-edit').addEventListener('click', () => {
    showScreen('list');
});

// Inicialização
window.onload = () => {
    if (getLoggedUser()) {
        loadPeopleList();
        showScreen('list');
    } else {
        showScreen('login');
    }
};