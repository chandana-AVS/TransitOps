import { MdDirectionsCar } from "react-icons/md";
import "./fleetutilization.css";


function FleetUtilization(){

    return(

        <div className="fleet-card">

            <div className="fleet-header">

                <h3>
                    Fleet Utilization
                </h3>

                <MdDirectionsCar/>

            </div>


            <div className="utilization-value">

                78%

            </div>


            <div className="progress-bar">

                <div className="progress-fill"></div>

            </div>


            <p>
                42 out of 54 vehicles are currently active
            </p>


        </div>

    );

}


export default FleetUtilization;