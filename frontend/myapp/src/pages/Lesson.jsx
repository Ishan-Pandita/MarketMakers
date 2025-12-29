//this component displays a single lesson dynamically based on lesson id present in URL.
import { useParams } from "react-router-dom"; // helps read URL
import { useState } from "react"; //for suggestion and input
import { modules } from "../data/dummyData"; //dummy data

function Lesson() {
  const { id } = useParams();

  const lesson = modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === Number(id));
  if (!lesson) return <h2>Lesson not found</h2>;

  const [suggestions, setSuggestions] = useState([]); //array of user suggestions
  const [input, setInput] = useState(""); //cuurent input

  //completion logic - gets all completed lessons from browser and converts to arr like [1,2,3]
  const completedLessons =
    JSON.parse(localStorage.getItem("completedLessons")) || []; //str->arr using json parse , if nothing exists use empty arr[]

  //to check lesson is completed or not
  const isCompleted = completedLessons.includes(lesson.id);
  //take old completed lessons and currett lesson id and send it to local storage
  function markCompleted() {
    if (isCompleted) return; //prevent duplicate
    localStorage.setItem(
      "completedLessons",
      JSON.stringify([...completedLessons, lesson.id])
    );
  }

  function addSuggestion() {
    if (input.trim() === "") return; //prevent empty suggestion
    setSuggestions([...suggestions, input]); //keep older and add new at end
    setInput(""); //clear input box after adding
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>{lesson.title}</h2>

      {isCompleted ? (
        <p style={{ color: "green" }}>Lesson completed</p>
      ) : (
        <button onClick={markCompleted}>Mark as completed</button>
      )}
      <p>{lesson.description}</p>

      <h4>Videos</h4>
      {lesson.videos.map((video, index) => (
        <p key={index}>
          <a href={video} target="_blank">
            Watch Video:{index + 1}
          </a>
        </p>
      ))}
      <hr />
      <h3>Suggestions/Doubts</h3>
      <input
        type="text"
        placeholder="Write your suggestions or doubt?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={addSuggestion}>Add</button>
      <ul>
        {suggestions.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
export default Lesson;
