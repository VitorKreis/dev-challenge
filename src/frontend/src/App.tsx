import img from "../../../layout/logo_multisearch.png"
import "./App.css"
function App() {

  return (
    <div className="container">
      <img src={img} />

      <h1>MultiSearch</h1>

        <form className="search" method="post">
          <input type="text" />
          <button type="submit">Search</button>
        </form>
    </div>
  )
}

export default App
