import React, { useState } from "react";
import FirstTab from "../AllTabs/FirstTab";
import SecondTab from "../AllTabs/SecondTab";
import ThirdTab from "../AllTabs/ThirdTab";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTab1 = () => {
    // update the state to tab1
    setActiveTab("tab1");
  };

  const handleTab2 = () => {
    // update the state to tab2
    setActiveTab("tab2");
  };

  const handleTab3 = () => {
    // update the state to tab3
    setActiveTab("tab3");
  };


  return (
    <div className="Tabs">
      <ul className="nav">
        <li className={activeTab === "tab1" ? "active" : ""} onClick={handleTab1}>Operadores</li>
        <li className={activeTab === "tab2" ? "active" : ""} onClick={handleTab2}>Clientes</li>
        <li className={activeTab === "tab3" ? "active" : ""} onClick={handleTab3}>Distribuição</li>
      </ul>
      <div className="outlet">
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