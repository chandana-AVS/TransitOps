import {
MdWarning,
MdBuild,
MdPerson
} from "react-icons/md";

import "./alerts.css";


const alerts=[

{
icon:<MdWarning/>,
title:"License Expiring",
message:"Alex license expires in 15 days"
},


{
icon:<MdBuild/>,
title:"Maintenance Due",
message:"Van-05 requires oil change"
},


{
icon:<MdPerson/>,
title:"Driver Issue",
message:"Driver safety score is low"
}

];



function Alerts(){

return(

<div className="alerts-card">


<h3>
Alerts
</h3>


{
alerts.map((alert,index)=>(


<div 
className="alert-item"
key={index}
>


{alert.icon}


<div>

<h4>
{alert.title}
</h4>

<p>
{alert.message}
</p>

</div>


</div>


))

}


</div>

);

}


export default Alerts;