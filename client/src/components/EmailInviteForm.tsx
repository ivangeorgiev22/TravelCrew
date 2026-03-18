import { useState } from "react";
import {sendInvite} from '../services/emailService'; 
interface FormInvite {
  onClose: () => void;
  tripId : number; 
}

export default function Invite({onClose, tripId} : FormInvite) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "name") setName(event.target.value);
    if (event.target.name === "email") setEmail(event.target.value);
  }

  const handleSubmit = async (event : React.SubmitEvent) => {
    event.preventDefault();
    try {
      await sendInvite(tripId, name, email)
      setName('')
      setEmail('')
      onClose()
    } catch(error) {
      console.log(error, "error no email send")
    }
  }

  return (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center text-center z-1001"
      onClick={onClose}
      >
        <div
        className="bg-black/60 p-6 rounded-md w-96"
        onClick={(e) => e.stopPropagation()}
      >
    <div>
      <h1 className="text-white font-semibold text-center">Send an invite</h1>
    <form onSubmit={handleSubmit} className = "bg-gray-500 rounded-lg justify-center flex-col">
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
        value={name} 
        onChange={handleChange} 
      
        placeholder="Ex: Joey Smith" 
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
        value={email} 
        onChange={handleChange} 
        placeholder="Enter a mail" 
        required
      />
      </div>
      <button className=" bg-gray-200 rounded-lg h-10 w-16 mb-5" type="submit">Invite</button>
    </form>
    </div>
    </div>
    </div>
  );
}

