async function registrarCertificado() {
    const id = parseInt(document.getElementById("idCertificado").value, 10);
    const nome = document.getElementById("nomeAluno").value;
    const curso = document.getElementById("curso").value;
    const dtEmissao = document.getElementById("dtEmissao").value;
    try {
        const user = {
            id: id,
            nome: nome,
            curso: curso,
            dtEmissao: dtEmissao
        };

        const response = await fetch('http://localhost:3000/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        if (response.ok) {
            idCertificado.value = "";
            nomeAluno.value = "";
            curso.value = "";
            dtEmissao.value = "";
            alert("Certificado registrado com sucesso!");
        } else {
            const error = await response.json();
            alert(`Erro: ${error.message}`);
        }
    } catch (error) {
        console.log("Erro:", error);
        alert("Erro ao registrar certificado.");
    }
}

async function consultarCertificado() {
    const id = document.getElementById("consultaId").value;
    console.log("id = ", id);
    try {
        const response = await fetch('http://localhost:3000/consultar/'+ id, {
            method: 'GET',
        });

        if (response.ok) {
            const cert = await response.json();
            document.getElementById("resultadoConsulta").innerText = `Nome: ${cert.nome}, Curso: ${cert.curso}, Data de Emissão: ${cert.dtEmissao}, Status: ${cert.status}`;
        } else {
            const error = await response.json();
            document.getElementById("resultadoConsulta").innerText = `Erro: ${error.message}`;
        }
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById("resultadoConsulta").innerText = `Erro ao consultar certificado: ${error.message}`;
    }
}

async function revogarCertificado() {
    const id = parseInt(document.getElementById("revogarId").value, 10);
    try {
        const response = await fetch('http://localhost:3000/revogar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        }); 
        if (response.ok) {
            document.getElementById("resultadoRevogacao").innerText = `Certificado com ID ${id} revogado com sucesso.`;
        } else {
            const error = await response.json();
            document.getElementById("resultadoRevogacao").innerText = `Erro: ${error.message}`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById("resultadoRevogacao").innerText = `Erro ao revogar certificado: ${error.message}`;
    }
}
