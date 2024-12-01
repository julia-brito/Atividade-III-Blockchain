// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Certificado {

    struct Certificate {
        int id;
        string nome;
        string curso;
        string dtEmissao;
        string status;
    }

    mapping(int => Certificate) public certificates;

    function registerCertificate(int id, string memory nome, string memory curso, string memory dtEmissao) public {
        require(certificates[id].id == 0, "Certificado ja registrado com esse ID");
        certificates[id] = Certificate(id, nome, curso, dtEmissao, "valido");
    }

    function getCertificate(int id) public view returns (string memory nome, string memory curso, string memory dtEmissao, string memory status) {
        require(certificates[id].id != 0, 'Certificado nao encontrado');
        Certificate memory cert = certificates[id];
        return (cert.nome, cert.curso, cert.dtEmissao, cert.status);
    }

    function revokeCertificate(int id) public {
        require(certificates[id].id != 0, "Certificado nao encontrado");
        certificates[id].status = "cancelado";
    }
}