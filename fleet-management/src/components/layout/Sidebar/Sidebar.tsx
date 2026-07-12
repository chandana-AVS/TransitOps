import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdDirectionsCar,
  MdPeople,
  MdRoute,
  MdBuild,
  MdLocalGasStation,
  MdAttachMoney,
  MdAssessment,
  MdSettings,
  MdLogout
} from "react-icons/md";

import "./Sidebar.css";


const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <MdDashboard />
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: <MdDirectionsCar />
  },
  {
    name: "Drivers",
    path: "/drivers",
    icon: <MdPeople />
  },
  {
    name: "Trips",
    path: "/trips",
    icon: <MdRoute />
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: <MdBuild />
  },
  {
    name: "Fuel Logs",
    path: "/fuel",
    icon: <MdLocalGasStation />
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: <MdAttachMoney />
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <MdAssessment />
  }
];


function Sidebar(){

return(

<div className="sidebar">


<div className="sidebar-logo">
    TransitOps
</div>


<nav>

{
menuItems.map((item)=>(

<NavLink
key={item.path}
to={item.path}
className="sidebar-link"
>

<span>
{item.icon}
</span>

{item.name}

</NavLink>

))
}

</nav>


<div className="sidebar-bottom">

<button>

<MdSettings/>

Settings

</button>


<button>

<MdLogout/>

Logout

</button>


</div>


</div>

);

}


export default Sidebar;