import { MdFileDownload } from "react-icons/md";
import "./dashboardheader.css";


function DashboardHeader() {

    return (

        <div className="dashboard-header">

            <div>
                <h1>
                    Dashboard
                </h1>

                <p>
                    Monitor your fleet operations and performance
                </p>

            </div>


            <div className="dashboard-actions">

                <span>
                    Updated: Today
                </span>


                <button>

                    <MdFileDownload />

                    Export Report

                </button>

            </div>


        </div>

    );

}


export default DashboardHeader;