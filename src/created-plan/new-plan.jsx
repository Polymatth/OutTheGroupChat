import React from "react";
import { useState } from "react";

export default function NewPlan(){
    function makeId() {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const [plan, setPlan] = useState({
    id: "",
    name: "",
    budget: "",
    people: "",
    destination: "",
    responses: [],
    residence:"",
    startEndDate: "",
    description: ""
})
return(
<div id ="new-plan-questions">
         <label htmlFor="plan-name">Plan Name</label><br /> 
         <input type="text" id="plan-name" name="plan-name" placeholder="ex. Group Vacation" /><br />

         <label htmlFor="budget">Budget and Expenses</label> <br />
         <input type="text" id="budget" name="budget" placeholder="ex. 2000$" /><br />

         <label htmlFor="people">Hoping For</label> <br />
         <input type="text" id="people" name="people" placeholder="ex. 5 friends" /><br />

         <label htmlFor="location">Location</label> <br />
         <input type="text" id="location" name="location" placeholder="ex. Seoul, South Korea" /><br />

         <label htmlFor="activities">Potential Activities</label> <br />
         <input type="text" id="activities" name="activities" placeholder="ex. Skiing, Hot Chocolate Expo" /><br />

         <label htmlFor="residence">Where we'll stay</label> <br />
         <input type="text" id="residence" name="residence" placeholder="ex. Great Wolf Lodge" /><br />

        <input type="submit" value="Submit" />
    </div>   
);

}