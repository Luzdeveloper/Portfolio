import { useState, useEffect } from "react";

export default function Admin() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    github: "",
    website: "",
  });

  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchProjects = async () => {
    const res = await fetch("http://localhost:5000/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("Vous devez être connecté.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      setMessage("✅ Projet ajouté !");
      setFormData({ title: "", description: "", github: "", website: "" });
      fetchProjects(); // recharge la liste
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!token) return alert("Token manquant");
    const confirm = window.confirm("Supprimer ce projet ?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      setMessage("🗑️ Projet supprimé");
      fetchProjects(); // recharge
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "1rem" }}>
      <h1>Admin – Gestion des projets</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Titre"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          name="github"
          placeholder="GitHub"
          value={formData.github}
          onChange={handleChange}
        />
        <input
          name="website"
          placeholder="Site web"
          value={formData.website}
          onChange={handleChange}
        />
        <button type="submit">Ajouter</button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Projets existants</h2>
      <ul>
        {projects.map((p) => (
          <li key={p._id}>
            <strong>{p.title}</strong> – {p.description}
            <button
              onClick={() => handleDelete(p._id)}
              style={{ marginLeft: "1rem" }}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
