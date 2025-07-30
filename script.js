function obterUsuarios() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function salvarUsuarios(usuarios) {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function mostrarLogin() {
  document.getElementById("telaLogin").style.display = "block";
  document.getElementById("telaCadastro").style.display = "none";
  document.getElementById("telaListagem").style.display = "none";
  document.getElementById("telaEditar").style.display = "none";
}

function mostrarCadastro() {
  document.getElementById("telaLogin").style.display = "none";
  document.getElementById("telaCadastro").style.display = "block";
  document.getElementById("telaListagem").style.display = "none";
  document.getElementById("telaEditar").style.display = "none";
}

function mostrarListagem() {
  document.getElementById("telaLogin").style.display = "none";
  document.getElementById("telaCadastro").style.display = "none";
  document.getElementById("telaListagem").style.display = "block";
  document.getElementById("telaEditar").style.display = "none";
  listarUsuarios();
}

function mostrarEditar() {
  document.getElementById("telaLogin").style.display = "none";
  document.getElementById("telaCadastro").style.display = "none";
  document.getElementById("telaListagem").style.display = "none";
  document.getElementById("telaEditar").style.display = "block";
}

document.getElementById("cadastroForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const novoUsuario = {
    id: Date.now(),
    nome: document.getElementById("nome").value,
    cpf: document.getElementById("cpf").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    dataNascimento: document.getElementById("dataNascimento").value,
    senha: document.getElementById("senha").value
  };
  const usuarios = obterUsuarios();
  usuarios.push(novoUsuario);
  salvarUsuarios(usuarios);
  alert("Usuário cadastrado!");
  mostrarLogin();
});

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;
  const usuarios = obterUsuarios();
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);
  if (usuario) {
    alert("Login bem-sucedido!");
    mostrarListagem();
  } else {
    alert("Email ou senha incorretos.");
  }
});

function listarUsuarios() {
  const lista = document.getElementById("listaPessoas");
  lista.innerHTML = "";
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
      </td>`;
    lista.appendChild(tr);
  });
}

function editarPessoa(id) {
  mostrarEditar();
  const usuarios = obterUsuarios();
  const usuario = usuarios.find(u => u.id === id);
  document.getElementById("editarId").value = usuario.id;
  document.getElementById("editarNome").value = usuario.nome;
  document.getElementById("editarCpf").value = usuario.cpf;
  document.getElementById("editarEmail").value = usuario.email;
  document.getElementById("editarTelefone").value = usuario.telefone;
  document.getElementById("editarDataNascimento").value = usuario.dataNascimento;
  document.getElementById("editarSenha").value = usuario.senha;
}

document.getElementById("editarForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const id = parseInt(document.getElementById("editarId").value);
  const usuarios = obterUsuarios();
  const index = usuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    usuarios[index] = {
      id,
      nome: document.getElementById("editarNome").value,
      cpf: document.getElementById("editarCpf").value,
      email: document.getElementById("editarEmail").value,
      telefone: document.getElementById("editarTelefone").value,
      dataNascimento: document.getElementById("editarDataNascimento").value,
      senha: document.getElementById("editarSenha").value
    };
    salvarUsuarios(usuarios);
    alert("Alterações salvas!");
    mostrarListagem();
  }
});

function excluirPessoa(id) {
  let usuarios = obterUsuarios();
  usuarios = usuarios.filter(u => u.id !== id);
  salvarUsuarios(usuarios);
  listarUsuarios();
}
