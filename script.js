// script.js - Lógica principal

// Função para obter dados do localStorage
function obterUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Função para salvar dados no localStorage
function salvarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// Cadastro
const cadastroForm = document.getElementById("cadastroForm");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const novoUsuario = {
      id: Date.now(),
      nome: document.getElementById("nome").value,
      cpf: document.getElementById("cpf").value,
      email: document.getElementById("email").value,
      telefone: document.getElementById("telefone").value,
      dataNascimento: document.getElementById("dataNascimento").value,
      senha: document.getElementById("senha").value,
    };
    const usuarios = obterUsuarios();
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    alert("Usuário cadastrado com sucesso!");
    window.location.href = "index.html";
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;
    const usuarios = obterUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (usuario) {
      alert("Login bem-sucedido!");
      window.location.href = "listar.html";
    } else {
      alert("Email ou senha incorretos.");
    }
  });
}

// Listagem
const listaPessoas = document.getElementById("listaPessoas");
if (listaPessoas) {
  const usuarios = obterUsuarios();
  usuarios.forEach(usuario => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${usuario.nome}</td>
      <td>${usuario.cpf}</td>
      <td>${usuario.email}</td>
      <td>${usuario.telefone}</td>
      <td>${usuario.dataNascimento}</td>
      <td>
        <button onclick="editarPessoa(${usuario.id})">Editar</button>
        <button onclick="excluirPessoa(${usuario.id})">Excluir</button>
      </td>
    `;
    listaPessoas.appendChild(tr);
  });
}

// Editar
function editarPessoa(id) {
  localStorage.setItem("editarId", id);
  window.location.href = "editar.html";
}

const editarForm = document.getElementById("editarForm");
if (editarForm) {
  const id = localStorage.getItem("editarId");
  const usuarios = obterUsuarios();
  const usuario = usuarios.find(u => u.id == id);

  document.getElementById("editarId").value = usuario.id;
  document.getElementById("editarNome").value = usuario.nome;
  document.getElementById("editarCpf").value = usuario.cpf;
  document.getElementById("editarEmail").value = usuario.email;
  document.getElementById("editarTelefone").value = usuario.telefone;
  document.getElementById("editarDataNascimento").value = usuario.dataNascimento;
  document.getElementById("editarSenha").value = usuario.senha;

  editarForm.addEventListener("submit", function (e) {
    e.preventDefault();
    usuario.nome = document.getElementById("editarNome").value;
    usuario.cpf = document.getElementById("editarCpf").value;
    usuario.email = document.getElementById("editarEmail").value;
    usuario.telefone = document.getElementById("editarTelefone").value;
    usuario.dataNascimento = document.getElementById("editarDataNascimento").value;
    usuario.senha = document.getElementById("editarSenha").value;

    salvarUsuarios(usuarios);
    alert("Alterações salvas com sucesso!");
    window.location.href = "listar.html";
  });
}

// Excluir
function excluirPessoa(id) {
  let usuarios = obterUsuarios();
  usuarios = usuarios.filter(u => u.id !== id);
  salvarUsuarios(usuarios);
  window.location.reload();
}
