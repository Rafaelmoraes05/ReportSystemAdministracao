async function lerTodosFuncionarios() {
    const uri = 'http://localhost:8080/funcionario/readAll';
    const req = await fetch(uri);
    if (!req.ok) throw new Error(`Erro HTTP! status: ${req.status}`);
    return req.json();
}

async function lerTodosSetores() {
    const uri = 'http://localhost:8080/setor/readAll';
    const req = await fetch(uri);
    if (!req.ok) throw new Error(`Erro HTTP! status: ${req.status}`);
    return req.json();
}

async function carregarDados() {
    try {
        const [setores, funcionarios] = await Promise.all([lerTodosSetores(), lerTodosFuncionarios()]);
        preencherSelect(setores);
        preencherTabelaFuncionarios(funcionarios);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function preencherTabelaFuncionarios(funcionarios) {
    const corpoTabela = document.getElementById('corpoTabelaColaboradores');
    corpoTabela.innerHTML = '';

    funcionarios.forEach(funcionario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${funcionario.nomeFuncionario}</td>
            <td>${funcionario.emailFuncionario}</td>
            <td>${funcionario.matriculaFuncionario}</td>
            <td>${funcionario.telefoneFuncionario}</td>
            <td>${funcionario.setorFuncionario.nomeSetor}</td>
            <td>
                <button class="btn btn-custom" onclick="editarFuncionario(${funcionario.idFuncionario})">Atualizar</button>
                <button class="btn btn-custom" onclick="excluirFuncionario(${funcionario.idFuncionario})">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}

function preencherSelect(setores) {
    const select = document.getElementById('departamentoColaborador');
    select.innerHTML = '';
    setores.forEach(setor => {
        const option = document.createElement('option');
        option.value = setor.idSetor;
        option.textContent = setor.nomeSetor;
        select.appendChild(option);
    });
}

document.getElementById('botaoCriarColaborador').addEventListener('click', () => {
    abrirModal('Criar Funcionário');
});

document.getElementById('botaoSalvarColaborador').addEventListener('click', salvarFuncionario);

async function salvarFuncionario() {
    const id = document.getElementById('idColaborador').value;
    const funcionario = {
        nomeFuncionario: document.getElementById('nomeColaborador').value,
        emailFuncionario: document.getElementById('emailColaborador').value,
        matriculaFuncionario: document.getElementById('matriculaColaborador').value,
        telefoneFuncionario: document.getElementById('telefoneColaborador').value,
        setorFuncionario: {
            idSetor: parseInt(document.getElementById('departamentoColaborador').value)
        }
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:8080/funcionario/update/${id}` : 'http://localhost:8080/funcionario/create';

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(funcionario)
    });

    const message = await response.text();
    document.getElementById('mensagemFeedback').innerText = message;
    document.getElementById('mensagemFeedback').style.display = 'block';
    carregarDados();
}

function abrirModal(titulo) {
    document.getElementById('modalColaboradorLabel').innerText = titulo;
    document.getElementById('idColaborador').value = '';
    document.getElementById('nomeColaborador').value = '';
    document.getElementById('emailColaborador').value = '';
    document.getElementById('matriculaColaborador').value = '';
    document.getElementById('telefoneColaborador').value = '';
    document.getElementById('departamentoColaborador').value = '';
    const modal = new bootstrap.Modal(document.getElementById('modalColaborador'));
    modal.show();
}

async function editarFuncionario(id) {
    const response = await fetch(`http://localhost:8080/funcionario/read/${id}`);
    const funcionario = await response.json();
    document.getElementById('modalColaboradorLabel').innerText = 'Atualizar Funcionário';
    document.getElementById('idColaborador').value = funcionario.idFuncionario;
    document.getElementById('nomeColaborador').value = funcionario.nomeFuncionario;
    document.getElementById('emailColaborador').value = funcionario.emailFuncionario;
    document.getElementById('matriculaColaborador').value = funcionario.matriculaFuncionario;
    document.getElementById('telefoneColaborador').value = funcionario.telefoneFuncionario;
    document.getElementById('departamentoColaborador').value = funcionario.setorFuncionario.idSetor;
    const modal = new bootstrap.Modal(document.getElementById('modalColaborador'));
    modal.show();
}

async function excluirFuncionario(id) {
    const response = await fetch(`http://localhost:8080/funcionario/delete/${id}`, {
        method: 'DELETE'
    });

    const message = await response.text();
    document.getElementById('mensagemFeedback').innerText = message;
    document.getElementById('mensagemFeedback').style.display = 'block';
    carregarDados();
}

// Carregar dados ao iniciar a página
carregarDados();
