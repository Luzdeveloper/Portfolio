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
  const [editId, setEditId] = useState(null);

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

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5000/api/projects/${editId}`
      : "http://localhost:5000/api/projects";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");

      setMessage(editId ? "✅ Projet mis à jour" : "✅ Projet ajouté");
      setFormData({ title: "", description: "", github: "", website: "" });
      setEditId(null);
      fetchProjects();
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
      fetchProjects();
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      description: project.description,
      github: project.github,
      website: project.website,
    });
    setEditId(project._id);
    setMessage("✏️ Modification du projet");
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ title: "", description: "", github: "", website: "" });
    setMessage("Modification annulée");
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: "1rem" }}>
      <h1>Admin – {editId ? "Modifier un projet" : "Ajouter un projet"}</h1>

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
        <button type="submit">{editId ? "Mettre à jour" : "Ajouter"}</button>
        {editId && <button onClick={cancelEdit}>Annuler</button>}
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h2>Projets</h2>
      <ul>
        {projects.map((p) => (
          <li key={p._id} style={{ marginBottom: "2rem" }}>
            <strong>{p.title}</strong> – {p.description}
            {p.website && (
              <>
                <div style={{ marginTop: "0.5rem" }}>
                  <iframe
                    src={p.website}
                    title={p.title}
                    width="100%"
                    height="200"
                    style={{ border: "1px solid #ccc" }}
                  />
                </div>
                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "0.5rem",
                    color: "#007acc",
                  }}
                >
                  🌐 Ouvrir dans un nouvel onglet
                </a>
              </>
            )}
            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => handleEdit(p)}
                style={{ marginRight: "0.5rem" }}
              >
                Modifier
              </button>
              <button onClick={() => handleDelete(p._id)}>Supprimer</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
