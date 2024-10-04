async function lerTodosSetores() {
    const uri = 'http://localhost:8080/setor/readAll';
    const req = await fetch(uri);
    if (!req.ok) throw new Error(`Erro HTTP! status: ${req.status}`);
    return req.json();
}

async function lerTodosReportes() {
    const uri = 'http://localhost:8080/reporte/readAll';
    const req = await fetch(uri);
    if (!req.ok) throw new Error(`Erro HTTP! status: ${req.status}`);
    return req.json();
}

async function carregarDados() {
    try {
        const [setores, reportes] = await Promise.all([lerTodosSetores(), lerTodosReportes()]);

        preencherSelect(setores);

        preencherTabelaHistorico(reportes);
        
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

function preencherTabelaHistorico(reportes) {
    const corpoTabela = document.getElementById('corpoTabelaHistorico');
    corpoTabela.innerHTML = '';

    // Contabiliza os reportes por tipo
    const contagemReportes = {};
    reportes.forEach(reporte => {
        contagemReportes[reporte.tipoReporte] = (contagemReportes[reporte.tipoReporte] || 0) + 1;
    });

    // Preenche a tabela com a contagem
    for (const tipo in contagemReportes) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${tipo}</td><td>${contagemReportes[tipo]}</td>`;
        corpoTabela.appendChild(row);
    }
}

function preencherSelect(setores) {
    const select = document.getElementById('selectDepartamento');
    select.innerHTML = '<option value="0">Selecione um setor</option>';

    setores.forEach(setor => {
        const option = document.createElement('option');
        option.value = setor.idSetor;
        option.textContent = setor.nomeSetor;
        select.appendChild(option);
    });
}

document.getElementById('botaoAplicarFiltro').addEventListener('click', async () => {
    const setorSelecionado = document.getElementById('selectDepartamento').value;
    const dataSelecionada = document.getElementById('inputDataFiltro').value;

    try {
        const reportes = await lerTodosReportes();
        const reportesFiltrados = filtrarReportes(reportes, setorSelecionado, dataSelecionada);
        preencherTabelaFiltrada(reportesFiltrados);
    } catch (error) {
        console.error("Erro ao filtrar reportes:", error);
    }
});

function filtrarReportes(reportes, setorSelecionado, dataSelecionada) {
    return reportes.filter(reporte => {
        const pertenceAoSetor = setorSelecionado == 0 || reporte.setor.idSetor == setorSelecionado;
        const noDiaSelecionado = !dataSelecionada || reporte.dataReporte === dataSelecionada;

        return pertenceAoSetor && noDiaSelecionado;
    });
}

function preencherTabelaFiltrada(reportes) {
    const corpoTabelaFiltrada = document.getElementById('corpoTabelaFiltrada');
    corpoTabelaFiltrada.innerHTML = '';

    // Contabiliza os reportes por tipo após o filtro
    const contagemReportesFiltrados = {};
    reportes.forEach(reporte => {
        contagemReportesFiltrados[reporte.tipoReporte] = (contagemReportesFiltrados[reporte.tipoReporte] || 0) + 1;
    });

    // Preenche a tabela filtrada com a contagem
    for (const tipo in contagemReportesFiltrados) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${tipo}</td><td>${contagemReportesFiltrados[tipo]}</td>`;
        corpoTabelaFiltrada.appendChild(row);
    }
}

// Carregar dados ao iniciar a página
carregarDados();
