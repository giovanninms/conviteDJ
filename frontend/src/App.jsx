import Navbar from "./components/navbar/navbar"
import Header from "./components/haeder/header"
import { Outlet } from "react-router-dom"
export default function App() {

  //const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Outlet />
      <Navbar />
    </>
  )
}


