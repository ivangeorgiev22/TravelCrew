import { useNavigate } from "react-router"

export default function NavBar () {
const navigate = useNavigate();
return (
  <div className="bg-orange-500 flex p-3 justify-between">
    <div>
      <h1 onClick={() => navigate('/dashboard')} className="cursor-pointer">TravelCrew</h1>
    </div>
    <div>
      <button onClick={() => navigate('/')} className="cursor-pointer">Logout</button>
    </div>
  </div>
)
}