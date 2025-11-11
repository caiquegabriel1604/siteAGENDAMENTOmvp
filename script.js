let users = JSON.parse(localStorage.getItem("users")) || [];
let agendamentos = JSON.parse(localStorage.getItem("agendamentos")) || [];
let usuarioLogado = null;

function mostrar(tela) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(tela).classList.add("ativa");
}

// ir para cadastros
document.getElementById("btnIrCadastroProf").onclick = () => mostrar("cadastroProf");
document.getElementById("btnIrCadastroAdm").onclick = () => mostrar("cadastroAdm");
document.getElementById("btnVoltarLogin1").onclick = () => mostrar("login");
document.getElementById("btnVoltarLogin2").onclick = () => mostrar("login");

// cadastro professor
document.getElementById("btnCadastrarProf").onclick = () => {
  let nome = document.getElementById("profNome").value;
  let email = document.getElementById("profEmail").value;
  let senha = document.getElementById("profSenha").value;
  let confirma = document.getElementById("profConfirma").value;
  if (!nome || !email || !senha || !confirma) return alert("Preencha tudo!");
  if (senha !== confirma) return alert("Senhas diferentes!");
  users.push({ nome, email, senha, tipo: "professor" });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Professor cadastrado!");
  mostrar("login");
};

// cadastro adm
document.getElementById("btnCadastrarAdm").onclick = () => {
  let nome = document.getElementById("admNome").value;
  let email = document.getElementById("admEmail").value;
  let senha = document.getElementById("admSenha").value;
  let confirma = document.getElementById("admConfirma").value;
  let codigo = document.getElementById("admCodigo").value;
  if (!nome || !email || !senha || !confirma || !codigo) return alert("Preencha tudo!");
  if (senha !== confirma) return alert("Senhas diferentes!");
  if (codigo !== "160409") return alert("Código incorreto!");
  users.push({ nome, email, senha, tipo: "adm" });
  localStorage.setItem("users", JSON.stringify(users));
  alert("ADM cadastrado!");
  mostrar("login");
};

// login
document.getElementById("btnLogin").onclick = () => {
  let user = document.getElementById("loginUser").value;
  let senha = document.getElementById("loginSenha").value;
  let tipo = document.getElementById("loginTipo").value;
  let codigo = document.getElementById("loginCodigo").value;

  let encontrado = users.find(u => u.nome === user && u.senha === senha && u.tipo === tipo);
  if (!encontrado) return alert("Usuário ou senha errados!");
  if (tipo === "adm" && codigo !== "160409") return alert("Código ADM incorreto!");

  usuarioLogado = encontrado;
  localStorage.setItem("logado", JSON.stringify(usuarioLogado));

  if (tipo === "professor") {
    mostrar("telaProf");
    carregarHorarios();
    atualizarAgendamentosProf();
  } else {
    mostrar("telaAdm");
    atualizarPainelAdm();
  }
};

// horários disponíveis
let horariosPadrao = ["07:10 - 08:00", "08:00 - 08:50", "08:50 - 09:40", "09:55 - 10:45", "10:45 - 11:35", "11:35 - 12:25"];

function carregarHorarios() {
  let div = document.getElementById("horarios");
  div.innerHTML = "";
  horariosPadrao.forEach(h => {
    let btn = document.createElement("button");
    btn.textContent = h;
    btn.onclick = () => agendar(h);
    div.appendChild(btn);
  });
}

function agendar(horario) {
  let turma = document.getElementById("turma").value;
  let materia = document.getElementById("materia").value;
  let data = document.getElementById("data").value;
  if (!turma || !materia || !data) return alert("Preencha tudo!");
  agendamentos.push({ professor: usuarioLogado.nome, turma, materia, data, horario, status: "pendente" });
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  alert("Agendamento solicitado!");
  atualizarAgendamentosProf();
}

// painel do professor
function atualizarAgendamentosProf() {
  let div = document.getElementById("meusAgendamentos");
  let meus = agendamentos.filter(a => a.professor === usuarioLogado.nome);
  div.innerHTML = "";
  if (meus.length === 0) div.innerHTML = "<p>Nenhum agendamento.</p>";
  meus.forEach(a => {
    let p = document.createElement("p");
    p.textContent = `${a.data} - ${a.horario} - ${a.materia} (${a.turma}) - ${a.status}`;
    div.appendChild(p);
  });
}

// painel ADM
function atualizarPainelAdm() {
  let pend = document.getElementById("pendentes");
  let aceitos = document.getElementById("aceitos");
  let recusados = document.getElementById("recusados");
  pend.innerHTML = "";
  aceitos.innerHTML = "";
  recusados.innerHTML = "";

  agendamentos.forEach((a, i) => {
    let info = `${a.professor} - ${a.data} - ${a.horario} - ${a.materia} (${a.turma})`;
    let div = document.createElement("div");
    div.textContent = info;

    if (a.status === "pendente") {
      let btnAceitar = document.createElement("button");
      btnAceitar.textContent = "Aceitar";
      btnAceitar.onclick = () => aceitar(i);

      let btnRecusar = document.createElement("button");
      btnRecusar.textContent = "Recusar";
      btnRecusar.onclick = () => recusar(i);

      div.appendChild(btnAceitar);
      div.appendChild(btnRecusar);
      pend.appendChild(div);
    } else if (a.status === "aceito") {
      aceitos.appendChild(div);
    } else if (a.status === "recusado") {
      recusados.appendChild(div);
    }
  });
}

function aceitar(i) {
  agendamentos[i].status = "aceito";
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  atualizarPainelAdm();
}

function recusar(i) {
  agendamentos[i].status = "recusado";
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos));
  atualizarPainelAdm();
}

// sair
document.getElementById("sairProf").onclick = sair;
document.getElementById("sairAdm").onclick = sair;

function sair() {
  usuarioLogado = null;
  localStorage.removeItem("logado");
  mostrar("login");
}

// iniciar tela inicial
mostrar("login");
