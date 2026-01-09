import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    API.get("/progress/me").then((res) => setProgress(res.data));
  }, []);
  return (
    <div>
      <h2>Your Progress</h2>
      <p>Completed Lessons:{progress.legth}</p>
      <ul>
        {progress.map((p) => (
          <li key={p._id}>{p.lessonid.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
