import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        console.log("données reçues", data);
        setProjects(data);
      })
      .catch((err) => console.error("erreur lors du fetch", err));
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: "2rem" }}>
      <h1>Bienvenue sur le portfolio de ...</h1>
      <h2>Mes projets</h2>
      <ul>
        {projects.map((proj) => (
          <li key={proj._id} style={{ marginBottom: "2rem" }}>
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>

            {proj.website && (
              <>
                <iframe
                  src={proj.website}
                  title={proj.title}
                  width="100%"
                  height="250"
                  style={{ border: "1px solid #ccc", marginTop: "1rem" }}
                />
                <div style={{ marginTop: "0.5rem" }}>
                  <a
                    href={proj.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginRight: "1rem", color: "#007acc" }}
                  >
                    🌐 Ouvrir le site
                  </a>
                </div>
              </>
            )}

            {proj.github && (
              <div>
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#333" }}
                >
                  🛠️ Voir le code sur GitHub
                </a>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
