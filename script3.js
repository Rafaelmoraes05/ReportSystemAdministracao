async function lerTodosSetores() {
    const uri = 'http://localhost:8080/setor/readAll';
    const req = await fetch(uri);
    if (!req.ok) throw new Error(`Erro HTTP! status: ${req.status}`);
    return req.json();
}

async function carregarDados() {
    try {
        const setores = await lerTodosSetores();
        preencherTabelaSetores(setores);
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function preencherTabelaSetores(setores) {
    const corpoTabela = document.getElementById('corpoTabelaSetores');
    corpoTabela.innerHTML = '';

    setores.forEach(setor => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${setor.nomeSetor}</td>
            <td>
                <button class="btn btn-custom" onclick="editarSetor(${setor.idSetor})">Atualizar</button>
                <button class="btn btn-custom" onclick="excluirSetor(${setor.idSetor})">Excluir</button>
            </td>
        `;
        corpoTabela.appendChild(tr);
    });
}

document.getElementById('botaoCriarSetor').addEventListener('click', () => {
    abrirModal('Criar Setor');
});

document.getElementById('botaoSalvarSetor').addEventListener('click', salvarSetor);

async function salvarSetor() {
    const id = document.getElementById('idSetor').value;
    const setor = {
        nomeSetor: document.getElementById('nomeSetor').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `http://localhost:8080/setor/update/${id}` : 'http://localhost:8080/setor/create';

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(setor)
        });

        const message = await response.text();
        const mensagemFeedback = document.getElementById('mensagemFeedback');
        mensagemFeedback.innerText = message;
        mensagemFeedback.classList.add('alert-success');
        mensagemFeedback.style.display = 'block';

        // Fechar o modal
        const modalSetor = bootstrap.Modal.getInstance(document.getElementById('modalSetor'));
        modalSetor.hide();

        // Recarregar os dados
        carregarDados();
    } catch (error) {
        console.error("Erro ao salvar setor:", error);
        const mensagemFeedback = document.getElementById('mensagemFeedback');
        mensagemFeedback.innerText = "Erro ao salvar setor. Por favor, tente novamente.";
        mensagemFeedback.classList.add('alert-danger');
        mensagemFeedback.style.display = 'block';
    }
}

function abrirModal(titulo) {
    document.getElementById('modalSetorLabel').innerText = titulo;
    document.getElementById('idSetor').value = '';
    document.getElementById('nomeSetor').value = '';
    const modal = new bootstrap.Modal(document.getElementById('modalSetor'));
    modal.show();
}

async function editarSetor(id) {
    try {
        const response = await fetch(`http://localhost:8080/setor/read/${id}`);
        const setor = await response.json();
        
        document.getElementById('modalSetorLabel').innerText = 'Atualizar Setor';
        document.getElementById('idSetor').value = setor.idSetor;
        document.getElementById('nomeSetor').value = setor.nomeSetor;
        
        const modal = new bootstrap.Modal(document.getElementById('modalSetor'));
        modal.show();
    } catch (error) {
        console.error("Erro ao carregar dados do setor:", error);
        const mensagemFeedback = document.getElementById('mensagemFeedback');
        mensagemFeedback.innerText = "Erro ao carregar dados do setor. Por favor, tente novamente.";
        mensagemFeedback.classList.add('alert-danger');
        mensagemFeedback.style.display = 'block';
    }
}

async function excluirSetor(id) {
    if (confirm('Tem certeza que deseja excluir este setor?')) {
        try {
            const response = await fetch(`http://localhost:8080/setor/delete/${id}`, {
                method: 'DELETE'
            });

            const message = await response.text();
            const mensagemFeedback = document.getElementById('mensagemFeedback');
            mensagemFeedback.innerText = message;
            mensagemFeedback.classList.add('alert-success');
            mensagemFeedback.style.display = 'block';
            
            carregarDados();
        } catch (error) {
            console.error("Erro ao excluir setor:", error);
            const mensagemFeedback = document.getElementById('mensagemFeedback');
            mensagemFeedback.innerText = "Erro ao excluir setor. Por favor, tente novamente.";
            mensagemFeedback.classList.add('alert-danger');
            mensagemFeedback.style.display = 'block';
        }
    }
}

// Carregar dados ao iniciar a página
carregarDados();