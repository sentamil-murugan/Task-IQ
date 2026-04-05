import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function CalendarPage(){

const [events,setEvents] = useState([]);

useEffect(()=>{
loadTasks();
},[]);

const loadTasks = async () => {

try{

const res = await axios.get("http://localhost:5000/tasks");

const calendarEvents = res.data.map(task => {

const startDate = new Date(task.deadline);

const endDate = new Date(task.deadline);
endDate.setHours(endDate.getHours()+2); // each task block = 2 hours

return{
title: `${task.title} (${task.priority})`,
start: startDate,
end: endDate
};

});

setEvents(calendarEvents);

}catch(error){

console.log(error);

}

};

return(

<div style={{
padding:"30px",
maxWidth:"1000px",
margin:"auto"
}}>

<h2 style={{
textAlign:"center",
marginBottom:"20px",
color:"#FFFFFF"
}}>
📅 Smart Task Calendar
</h2>

<div style={{
height:"650px",
background:"white",
borderRadius:"10px",
padding:"10px"
}}>

<Calendar
localizer={localizer}
events={events}
startAccessor="start"
endAccessor="end"
views={["month","week","day","agenda"]}
defaultView="week"
style={{height:"100%"}}
/>

</div>

</div>

);

}

export default CalendarPage;