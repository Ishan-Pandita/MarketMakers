import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Lessons() {
  const { id } = useParams();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    API.get(`/lessons/module/%{id}`).then((res) => setLessons(res.data));
  }, [id]);

  return (
    <div>
      <h2>Lessons</h2>
      {lessons.map((l) => (
        <p key={l._id}>
          <Link to={`/lesson/${l._id}`}>{l.title}</Link>
        </p>
      ))}
    </div>
  );
}
export default Lessons;
