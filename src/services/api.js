import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function askQuestion(question) {
  const res = await api.post("/ask", { question });
  return res.data;
}

export async function searchDocuments(query) {
  const res = await api.post("/search", { query });
  return res.data;
}

export default api;
