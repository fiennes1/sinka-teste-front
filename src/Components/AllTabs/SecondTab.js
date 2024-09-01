import React, { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";

const TabelaComEdicaoEDelecao = () => {
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoNascimento, setNovoNascimento] = useState("");
  const [novoValor, setNovoValor] = useState("");
  const [novoEmail, setNovoEmail] = useState("");

  const [novoItemNome, setNovoItemNome] = useState("");
  const [novoItemNascimento, setNovoItemNascimento] = useState("");
  const [novoItemValor, setNovoItemValor] = useState("");
  const [novoItemEmail, setNovoItemEmail] = useState("");

  // Função para formatar a data
  const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Função para buscar clientes do backend
  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://nodedatabase.cvamkqwoka27.us-east-1.rds.amazonaws.com:3306/clientes");
      setDados(
        response.data.map((item) => ({
          ...item,
          nascimento: formatarData(item.nascimento),
        }))
      );
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  // Chama fetchClientes quando o componente monta
  useEffect(() => {
    fetchClientes();
  }, []);

  // Função para deletar um cliente
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://nodedatabase.cvamkqwoka27.us-east-1.rds.amazonaws.com:3306/clientes/${id}`);
      setDados(dados.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
    }
  };

  // Função para iniciar a edição de um cliente
  const handleEdit = (item) => {
    setEditando(item.id);
    setNovoNome(item.nome);
    setNovoNascimento(item.nascimento);
    setNovoValor(item.valor);
    setNovoEmail(item.email);
  };

  // Função para salvar as alterações de um cliente
  const handleSave = async (id) => {
    try {
      const response = await axios.put(`http://nodedatabase.cvamkqwoka27.us-east-1.rds.amazonaws.com:3306/clientes/${id}`, {
        nome: novoNome,
        nascimento: novoNascimento,
        valor: novoValor,
        email: novoEmail,
      });
      setDados(dados.map((item) => (item.id === id ? response.data : item)));
      setEditando(null);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
    }
  };

  // Função para adicionar um novo cliente
  const handleAdd = async () => {
    try {
      const response = await axios.post("http://nodedatabase.cvamkqwoka27.us-east-1.rds.amazonaws.com:3306/clientes", {
        nome: novoItemNome,
        nascimento: novoItemNascimento,
        valor: novoItemValor,
        email: novoItemEmail,
      });
      setDados([...dados, response.data]);
      setNovoItemNome("");
      setNovoItemNascimento("");
      setNovoItemValor("");
      setNovoItemEmail("");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
    }
  };

  // Função para processar o upload do CSV e salvar no banco de dados
  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: async (results) => {
        const clientes = results.data.map(([nome, nascimento, valor, email]) => ({
          nome,
          nascimento: formatarDataInversa(nascimento), // Converte o formato de data para YYYY-MM-DD
          valor: parseFloat(valor),
          email,
        }));

        try {
          // Envia cada cliente para o backend para ser salvo no banco de dados
          await Promise.all(
            clientes.map((cliente) =>
              axios.post("http://nodedatabase.cvamkqwoka27.us-east-1.rds.amazonaws.com:3306/clientes", cliente)
            )
          );
          fetchClientes(); // Atualiza a lista de clientes
          console.log("Clientes salvos com sucesso!");
        } catch (error) {
          console.error("Erro ao salvar clientes do CSV:", error);
        }
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  // Função para formatar a data para o formato YYYY-MM-DD
  const formatarDataInversa = (data) => {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  };

  return (
    <div>
      {/* Input para upload de CSV */}
      <div>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="input-field"
        />
      </div>

      {/* Formulário para adicionar novo cliente */}
      <div>
        <input
          type="text"
          className="input-field"
          placeholder="Nome"
          value={novoItemNome}
          onChange={(e) => setNovoItemNome(e.target.value)}
        />
        <input
          type="date"
          className="input-field"
          placeholder="Nascimento"
          value={novoItemNascimento}
          onChange={(e) => setNovoItemNascimento(e.target.value)}
        />
        <input
          type="number"
          className="input-field"
          placeholder="Valor"
          value={novoItemValor}
          onChange={(e) => setNovoItemValor(e.target.value)}
        />
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={novoItemEmail}
          onChange={(e) => setNovoItemEmail(e.target.value)}
        />
        <button className="add-button" onClick={handleAdd}>
          Adicionar
        </button>
      </div>

      {/* Contêiner para rolagem da tabela */}
      <div style={{ overflowX: "auto", maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd", marginTop: "20px" }}>
        <table border="1" cellPadding="10" style={{ width: "100%", minWidth: "600px" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Nascimento</th>
              <th>Valor</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {editando === item.id ? (
                    <input
                      type="text"
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                    />
                  ) : (
                    item.nome
                  )}
                </td>
                <td>
                  {editando === item.id ? (
                    <input
                      type="date"
                      value={novoNascimento}
                      onChange={(e) => setNovoNascimento(e.target.value)}
                    />
                  ) : (
                    item.nascimento
                  )}
                </td>
                <td>
                  {editando === item.id ? (
                    <input
                      type="number"
                      value={novoValor}
                      onChange={(e) => setNovoValor(e.target.value)}
                    />
                  ) : (
                    item.valor
                  )}
                </td>
                <td>
                  {editando === item.id ? (
                    <input
                      type="email"
                      value={novoEmail}
                      onChange={(e) => setNovoEmail(e.target.value)}
                    />
                  ) : (
                    item.email
                  )}
                </td>
                <td>
                  {editando === item.id ? (
                    <button
                      className="add-button"
                      onClick={() => handleSave(item.id)}
                    >
                      Salvar
                    </button>
                  ) : (
                    <>
                      <button
                        className="add-button"
                        onClick={() => handleEdit(item)}
                      >
                        Editar
                      </button>
                      <button
                        className="add-button"
                        onClick={() => handleDelete(item.id)}
                      >
                        Deletar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaComEdicaoEDelecao;
