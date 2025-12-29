import { modules } from "../data/dummyData";
function Dashboard() {
  const completedLessons =
    JSON.parse(localStorage.getItem("completedLessons")) || [];

  //reduce used to combine total values of array into single value
  const totalLessons = modules.reduce(
    (count, module) => count + module.lessons.length,
    0
  ); //total number of lessons across all modules

  //progress
  const progress = Math.round((completedLessons.lenghth / totalLessons) * 100);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Your learning Dashboard</h2>
      <p>Completed Lessons: {completedLessons.lenghth}</p>
      <p>Total Lessons:{totalLessons}</p>
      <p>Progress:{progress || 0}%</p>
    </div>
  );
}
export default Dashboard;
