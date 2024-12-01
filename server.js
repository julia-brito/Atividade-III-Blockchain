const express = require('express');
const { Web3 } = require('web3');
const cors = require('cors');
const path = require('path');
const { abi } = require('./build/contracts/Certificado.json');

//console.log(abi);
const app = express();
app.use(express.static(path.join(__dirname, 'src')));

const port = 3000;

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3 = new Web3(provider);

app.use(cors());
app.use(express.json());

const contratoEndereco = '0x007aa26b02d90c1ab56b0fa536cd143b6661a79731d69aa7ed5ddca99090eb03';
const contrato = new web3.eth.Contract(abi, contratoEndereco);

app.post('/registrar', async (req, res) => {
    const { id, nome, curso, dtEmissao } = req.body;
    const accounts = await web3.eth.getAccounts();

    try {
        await contrato.methods.registerCertificate(id, nome, curso, dtEmissao)
            .send({ from: accounts[0], gas: 500000 });
        res.json({ message: 'Certificado registrado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/consultar/:id', async (req, res) => {
    const { id } = req.params;
    const idInt = parseInt(id, 10);

    console.log(id);
    console.log(`Consultando certificado usando ID: ${idInt}`);

    try {
        const certificado = await contrato.methods.getCertificate(idInt).call();
        console.log(certificado);
        if (!certificado) {
            res.status(404).json({ message: 'Certificado não encontrado...' });
            return;
        }
        res.json({
            nome: certificado[0], 
            curso: certificado[1],      
            dtEmissao: certificado[2],   
            status: certificado[3] 
            // nome: certificado.nome,
            // curso: certificado.curso,
            // dtEmissao: certificado.dtEmissao,
            // status: certificado.status
        });
    } catch (error) {
        console.error("Erro ao consultar certificado:", error);
        res.status(500).json({ message: 'Erro ao consultar certificado', error: error.message });
    }
});


app.post('/revogar', async (req, res) => {
    const { id } = req.body;
    const accounts = await web3.eth.getAccounts();
    try {
        await contrato.methods.revokeCertificate(id)
            .send({ from: accounts[0], gas: 500000 });
        res.json({ message: 'Certificado revogado!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
