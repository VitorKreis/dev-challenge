import React, { useState } from "react";
import img from "../../../layout/logo_multisearch.png"
import "./App.css";

function App() {


  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [erro, setErro] = useState("");



  async function consultarJson(e: React.FormEvent<HTMLFormElement>){


    e.preventDefault()


    try {
      const data = await fetch(`http://localhost:3001/api/consulta?query=${query}`);

      


      if(!data.ok){
        throw new Error("Erro ao carregar o arquivo JSON");
      }

      const json = await data.json();

      console.log(json)


      const filtrados = json.filter((item: string) =>
        Object.values(item).some((valor) =>
          valor.toString().toLowerCase().includes(query.toLowerCase())
        )
      );


      setResultados(filtrados);
      setErro("");

    } catch (error) {
      setErro("Erro ao consultar os dados. Verifique o arquivo JSON.");
      setResultados([]);
    }
  }

  return (
    <>
    <div className="head">
  <img src={img} alt="Logo MultiSearch" />

  <h1>MultiSearch</h1>

  <form className="search" onSubmit={consultarJson}>
    <input
      type="text"
      placeholder="Digite sua consulta"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    <button type="submit">Pesquisar</button>
  </form>
</div>

<div className="results">
  {resultados.length > 0 ? (
    <table className="table table-bordered table-hover">
      <thead className="table-primary">
        <tr>
          <th scope="col">Campo</th>
          <th scope="col">Valor</th>
        </tr>
      </thead>
      <tbody>
        {resultados.map((resultado, index) => (
          <React.Fragment key={index}>
            {Object.entries(resultado).map(([campo, valor]) => (
              <tr key={`${index}-${campo}`}>
                <td>{campo}</td>
                <td>{valor !== undefined && valor !== null ? String(valor) : 'N/A'}</td>
              </tr>
            ))}
            <tr>
              <td  className="text-center bg-light">
                <strong>Fim do Registro</strong>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  ) : (
    !erro && <p className="text-muted">Nenhum resultado encontrado.</p>
  )}
</div>

    
    </>
  )
}

export default App
