import React, { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutDetails = (props) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState("");

  const [emptyFields, setEmptyFields] = useState([]);
  const handleDelete = async () => {
    if (!user) {
      return;
    }
    const response = await fetch("/api/workouts/" + props.workout._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const workout = { title, load, reps };
    const response = await fetch("/api/workouts/" + props.workout._id, {
      method: "PATCH",
      body: JSON.stringify(workout),
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    }
    if (response.ok) {
      setTitle("");
      setReps("");
      setLoad("");
      setEmptyFields([]);
      dispatch({ type: "EDIT_WORKOUT", payload: json });
      setError(null);
      console.log("Workout edited", json);
      setIsOpen(false);
    }
  };
  return (
    <>
      {isOpen && (
        <div id="myModal" className="modal">
          <div className="modal-content">
            <form className="edit" onSubmit={handleEdit}>
              <h3>Edit workout </h3>
              <label>Exercise title</label>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes("title") ? "error" : ""}
              />
              <label>Load(kg)</label>
              <input
                type="number"
                onChange={(e) => setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes("load") ? "error" : ""}
              />
              <label>Reps</label>
              <input
                type="number"
                onChange={(e) => setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes("reps") ? "error" : ""}
              />
              <div className="modal-buttons">
                <button type="submit">Edit workout</button>
                <button onClick={closeModal} className="closeButton">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="workout-details">
        <h4>{props.workout.title}</h4>
        <p>
          <strong>Load(kg): </strong>
          {props.workout.load}
        </p>
        <p>
          <strong>Reps: </strong>
          {props.workout.reps}
        </p>
        <p>
          {formatDistanceToNow(new Date(props.workout.createdAt), {
            addSuffix: true,
          })}
        </p>
        <span className="material-symbols-outlined edit" onClick={openModal}>
          edit
        </span>
        <span
          className="material-symbols-outlined delete"
          onClick={handleDelete}
        >
          delete
        </span>
      </div>
    </>
  );
};

export default WorkoutDetails;
