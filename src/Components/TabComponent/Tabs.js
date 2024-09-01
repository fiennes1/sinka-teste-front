import React, { useState } from "react";
import FirstTab from "../AllTabs/FirstTab";
import SecondTab from "../AllTabs/SecondTab";
import ThirdTab from "../AllTabs/ThirdTab";

//Componente Tabs, gerencia a navegação entre três abas: Operadores, Clientes e Distribuição
const Tabs = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  //Função handleTab1: atualiza o estado para "tab1" indo para aba "Operadores"
  const handleTab1 = () => {
    setActiveTab("tab1");
  };

  //Função handleTab2: atualiza o estado para "tab2" indo para aba "Clientes"
  const handleTab2 = () => {
    setActiveTab("tab2");
  };

  //Função handleTab3: atualiza o estado para "tab3" indo para aba "Distribuição"
  const handleTab3 = () => {
    setActiveTab("tab3");
  };


  return (
    <div className="Tabs">
      <ul className="nav">
        {/*Define qual aba está ativa e permite alternar entre elas*/}
        <li className={activeTab === "tab1" ? "active" : ""} onClick={handleTab1}>Operadores</li>
        <li className={activeTab === "tab2" ? "active" : ""} onClick={handleTab2}>Clientes</li>
        <li className={activeTab === "tab3" ? "active" : ""} onClick={handleTab3}>Distribuição</li>
      </ul>
      <div className="outlet">
        {/* Renderiza o componente correspondente à aba ativa */}
        {activeTab === "tab1" ? (
          <FirstTab />
        ) : activeTab === "tab2" ? (
          <SecondTab />
        ) : (
          <ThirdTab />
        )}
      </div>

    </div>
  );
};
export default Tabs;