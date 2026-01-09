import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Lesson() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    API.get(`lessons/${id}`).then((res) => setLesson(res.data));
    API.get(`/suggestionns/lessons/${id}`).then((res) =>
      setSuggestions(res.data)
    );
  }, [id]);

  async function addSuggestion() {
    await API.post("/suggestions", {
      lessonid: id,
      text,
    });
    setText("");
    const res = await API.get(`/suggestions/lesson/${id}`);
    setSuggestions(res.data);
  }
  async function markCompleted() {
    await API.post("/progress", { lessonid: id });
    alert("Lesson completed");
  }
  if (!lesson) return <p>Loading...</p>;
  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>{lesson.explanation}</p>

      <h4>Videos</h4>
      {lesson.videoLinks.map((v, i) => (
        <p key={i}>
          <a href={v} target="_blank">
            Watch Video
          </a>
        </p>
      ))}
      <button onClick={markCompleted}>Mark Completed</button>

      <h3>Suggestions</h3>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addSuggestion}>Add</button>

      <ul>
        {suggestions.map((s) => (
          <li key={s._id}>{s.text}</li>
        ))}
      </ul>
    </div>
  );
}
export default Lesson;
