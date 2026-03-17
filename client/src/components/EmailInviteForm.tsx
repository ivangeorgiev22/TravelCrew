import { useState } from "react";
//import {sendEmail} from '../services/emailService'; 
//import type {formData} from '../types/inviteForm'; 

//interface FormInvite {}

export default function Invite() {
  const [invite, setInvite] = useState({name : '', email: ''}); 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInvite({...invite, [event.target.name]: event.target.value} )
  }

  //const handleSubmit = (event : React.SubmitEvent) => {
    //event.preventDefault();
    //try {
      //await sendEmail(...invite) 
    //} catch(error) {
      //console.log(error, "error no email send")
    //}
  //}

  return (
  <div>
    <form className = "size-70  bg-gray-500 rounded-lg">
      <h1 className="text-white font-semibold">Send an invite</h1>
       <div>
        <label
          htmlFor="name"
          className="block text-base font-medium text-white mt-5"
        >
          Name
        </label>
      <input className=" bg-gray-100 mb-5 w-32" 
        type ="text" 
        id= "name"
        name="name"
        value={invite.name} 
        onChange={handleChange} 
      
        placeholder="Enter a name" 
        required
      />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-base font-medium text-white"
        >
          Email
        </label>
      <input className=" bg-gray-100 mb-5 w-32" 
        type ="text" 
        id= "email"
        name="email"
        value={invite.email} 
        onChange={handleChange} 
        placeholder="Enter a mail" 
        required
      />
      </div>
      <button className=" bg-gray-200 rounded-lg h-10 w-16" type="submit">Invite</button>
    </form>
    </div>
  );
}

