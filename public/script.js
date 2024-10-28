document.addEventListener('DOMContentLoaded', () => {
    // Função para enviar o formulário de geração de arquivos
    async function sendForm(formData, type) {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = `Gerando arquivo de ${type}, por favor aguarde...`;

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error('Erro ao gerar o arquivo.');

            const result = await response.json();
            statusDiv.textContent = `Arquivo de ${type} gerado com sucesso! O arquivo foi salvo em: ${result.path}`;
        } catch (error) {
            statusDiv.textContent = `Erro: ${error.message}`;
        }
    }

    // Adiciona eventos de submit e click para os formulários
    document.getElementById('form-tabloide').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('model', document.getElementById('model-perfumaria-geral').value);
        await sendForm(formData, 'Trier');
    });

    document.getElementById('form-perfumaria').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('model', document.getElementById('model-perfumaria').value);
        await sendForm(formData, 'Perfumaria');
    });

    document.getElementById('form-medicamento').addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('model', document.getElementById('model-medicamento').value);
        await sendForm(formData, 'Medicamento');
    });

    // Adiciona eventos para os botões de geração específica
    document.getElementById('generate-alpha7').addEventListener('click', async function() {
        const formData = new FormData(document.getElementById('form-tabloide'));
        formData.append('model', 'Alpha7');
        await sendForm(formData, 'Alpha7');
    });

    document.getElementById('generate-big').addEventListener('click', async function() {
        const formData = new FormData(document.getElementById('form-tabloide'));
        formData.append('model', 'BIG');
        await sendForm(formData, 'BIG');
    });

    document.getElementById('generate-all').addEventListener('click', async function() {
        const formData = new FormData(document.getElementById('form-tabloide'));
        formData.append('model', 'Todos');
        await sendForm(formData, 'Todos');
    });
});
