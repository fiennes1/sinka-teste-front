import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";

const ThirdTab = () => {
  const [clientes, setClientes] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [distribuicaoInicial, setDistribuicaoInicial] = useState({});
  const [distribuicao, setDistribuicao] = useState({});
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // Função para buscar operadores do backend
  const fetchOperadores = async () => {
    try {
      const response = await axios.get("http://98.81.224.210:3000/operadores");
      setOperadores(response.data);
    } catch (error) {
      console.error("Erro ao buscar operadores:", error);
    }
  };

  // Função para buscar clientes do backend
  const fetchClientes = async () => {
    try {
      const response = await axios.get("http://98.81.224.210:3000/clientes");
      setClientes(response.data);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

 

  // useEffect para buscar operadores e clientes quando o componente monta
  useEffect(() => {
    const fetchData = async () => {
      await fetchOperadores();
      await fetchClientes();
      setDadosCarregados(true); // Marca que operadores e clientes foram carregados
    };
    fetchData();
  }, []);


  // Função para distribuir clientes entre operadores de forma sequencial
  const distribuirClientes = () => {
    if (operadores.length === 0 || clientes.length === 0) return;

    const novaDistribuicao = operadores.reduce((acc, operador) => {
      acc[operador.nome] = [];
      return acc;
    }, {});

    clientes.forEach((cliente, index) => {
      const operador = operadores[index % operadores.length];
      if (novaDistribuicao[operador.nome]) {
        novaDistribuicao[operador.nome].push(cliente);
      }
    });

    setDistribuicao(novaDistribuicao);
    console.log("Distribuição manual:", novaDistribuicao); // Verifica a distribuição manual
  };



  // Dados para exportação para CSV
  const dadosParaCSV = Object.entries(distribuicao).flatMap(([operador, clientes]) =>
    clientes.map(cliente => ({
      Operador: operador,
      Nome: cliente.nome,
      Nascimento: formatarData(cliente.nascimento),
      Valor: cliente.valor,
      Email: cliente.email,
    }))
  );

  return (
    <div className="ThirdTab">
      <button className="add-button" onClick={distribuirClientes}>Distribuir Clientes</button>

      {/* Listagem de operadores com seus clientes */}
      <h3>Operadores e seus Clientes</h3>
      <br />
      <div style={{ maxHeight: '800px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px' }}>
        {Object.entries(distribuicao).map(([operador, clientes]) => (
          <div key={operador} style={{ marginBottom: '20px' }}>
            <h4>{operador}</h4>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Nome</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Data de Nascimento</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Valor</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Email</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente, index) => (
                  <tr key={`${operador}-${cliente.id}-${index}`}>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{cliente.nome}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{formatarData(cliente.nascimento)}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{cliente.valor}</td>
                    <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{cliente.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <CSVLink 
        data={dadosParaCSV}
        filename={"distribuicao.csv"}
        className="add-button"
        target="_blank"
      >
        Exportar para CSV
      </CSVLink>
    </div>
  );
};

export default ThirdTab;
