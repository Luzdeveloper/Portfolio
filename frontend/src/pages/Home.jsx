import { useEffect, useState } from "react";

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        console.log("données reçues", data);
        // On met à jour l'état avec les données reçues
        setProjects(data);
      })
      .catch((err) => console.error("erreur lors du fetch", err));
  }, []);

  return (
    <div>
      <h1>Bienvenue sur le portfolio de ...</h1>
      <h2>Mes projets</h2>
      <ul>
        {projects.map((proj) => (
          <li key={proj._id}>
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            {proj.github && <a href={proj.github}>Github</a>}
            <br />
            {proj.website && <a href={proj.website}>Site web</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}
