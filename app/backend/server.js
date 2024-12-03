import express from "express"

import fs from "fs"

import path from "path"


import cors from "cors"


const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Caminho para a pasta "data"
const dataPath = path.join("../../data");

// Função para ler um arquivo JSON
const readJsonFile = (fileName) => {
  const filePath = path.join(dataPath, fileName);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// Endpoint para consulta
app.get("/api/consulta", (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query string é obrigatória" });
  }

  try {
    // Lendo todas as tabelas
    const equipments = readJsonFile("equipments.json");
    const materials = readJsonFile("materials.json");
    const orders = readJsonFile("purchase_orders.json");
    const sales = readJsonFile("sales_orders.json");
    const workforce = readJsonFile("workforce.json");

    // Normalizando os dados
    const normalizeData = {
      equipments: equipments.map((equi) => ({
        tipo: "equipments",
        ...equi,
      })),
      materials: materials.map((mat) => ({
        tipo: "materials",
        ...mat,
      })),
      orders: orders.map((or) => ({
        tipo: "orders",
        ...or,
      })),
      sales: sales.map((sal) => ({
        tipo: "sales",
        ...sal,
      })),
      workforce: workforce.map((work) => ({
        tipo: "workforce",
        ...work,
      }))
    };

    // Combinando os dados e filtrando pela query
    const todosOsDados = [
      ...normalizeData.equipments,
      ...normalizeData.materials,
      ...normalizeData.orders,
      ...normalizeData.sales,
      ...normalizeData.workforce
    ];

    const resultados = todosOsDados.filter((item) =>
      Object.values(item).some((valor) =>
        valor.toString().toLowerCase().includes(query.toLowerCase())
      )
    );

    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao processar os dados" });
  }
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});