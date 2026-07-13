import React from "react";
import {useWorkoutsContext} from "../hooks/useWorkoutsContext"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutDetails = (props) => {
  const {dispatch} = useWorkoutsContext()
  const {user} = useAuthContext()
  const handleDelete = async ()=>{
    if(!user){
      return
    }
    const response = await fetch("/api/workouts/" + props.workout._id, {
      method:"DELETE",
      headers:{
        "Authorization":`Bearer ${user.token}`
      }
    })
    const json = await response.json()
    if(response.ok){
      dispatch({type:"DELETE_WORKOUT", payload:json})
    }
  }
  const handleEdit = async()=>{
    if(!user){
      return
    }
    const response = await fetch("/api/workouts/" +props.workout._id, {
      method:"PATCH",
      headers:{
        "content-type":"application/json",
        "Authorization":`Bearer ${user.token}`
      }
    })
  }
  return (
    <div className="workout-details">
      <h4>{props.workout.title}</h4>
      <p>
        <strong>Load(kg): </strong>{props.workout.load}
      </p>
      <p>
        <strong>Reps: </strong>{props.workout.reps}
      </p>
      <p>
        {formatDistanceToNow(new Date(props.workout.createdAt), {addSuffix:true})}
      </p>
      <span className="material-symbols-outlined edit" onClick={handleEdit}>edit</span>
      <span className="material-symbols-outlined delete" onClick={handleDelete}>delete</span>
    </div>
  );
};

export default WorkoutDetails;
