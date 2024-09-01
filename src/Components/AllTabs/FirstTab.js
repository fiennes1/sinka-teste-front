import React, { useState, useEffect } from "react";
import axios from "axios";

const TabelaComEdicaoEDelecao = () => {
  // Estado para os dados da tabela
  const [dados, setDados] = useState([]);
  const [editando, setEditando] = useState(null);
  const [novoNome, setNovoNome] = useState("");
  const [novoItemNome, setNovoItemNome] = useState("");

  // Função para buscar operadores do backend
  const fetchOperadores = async () => {
    try {
      const response = await axios.get("http://localhost:3000/operadores");
      setDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar operadores:", error);
    }
  };

  // useEffect para buscar operadores quando o componente monta
  useEffect(() => {
    fetchOperadores();
  }, []);

  // Função para deletar um operador
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/operadores/${id}`);
      setDados(dados.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar operador:", error);
    }
  };

  // Função para iniciar a edição de um operador
  const handleEdit = (item) => {
    setEditando(item.id);
    setNovoNome(item.nome);
  };

  // Função para salvar as alterações de um operador
  const handleSave = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/operadores/${id}`, {
        nome: novoNome,
      });
      setDados(dados.map((item) => (item.id === id ? response.data : item)));
      setEditando(null);
    } catch (error) {
      console.error("Erro ao atualizar operador:", error);
    }
  };

  // Função para adicionar um novo operador
  const handleAdd = async () => {
    try {
      const response = await axios.post("http://localhost:3000/operadores", {
        nome: novoItemNome,
      });
   
      setDados([...dados, response.data]);
      setNovoItemNome("");
    } catch (error) {
      console.error("Erro ao adicionar operador:", error);
    }
  };

  return (
    <div>
      {/* Formulário para adicionar novo operador */}
      <div>
        <input
          type="text"
          className="input-field"
          placeholder="Nome"
          value={novoItemNome}
          onChange={(e) => setNovoItemNome(e.target.value)}
        />
        <button className="add-button" onClick={handleAdd}>
          Adicionar
        </button>
      </div>

      {/* Tabela de operadores */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
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
  );
};

export default TabelaComEdicaoEDelecao;