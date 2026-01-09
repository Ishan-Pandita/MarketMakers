import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Modules() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    API.get("/modules").then((res) => setModules(res.data));
  }, []);

  return (
    <div>
      <h2>Learning Modules</h2>
      {modules.map((m) => (
        <div key={m._id}>
          <h3>{m.title}</h3>
          <Link to={`/module/${m._id}`}>View Lessons</Link>
        </div>
      ))}
    </div>
  );
}

export default Modules;
