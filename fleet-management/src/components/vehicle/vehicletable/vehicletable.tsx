import "./vehicletable.css";

interface Vehicle {
  registration: string;

  model: string;

  type: string;

  capacity: string;

  status: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
}

function VehicleTable({ vehicles }: VehicleTableProps) {
  return (
    <div className="vehicle-table">
      <table>
        <thead>
          <tr>
            <th>Registration</th>
            <th>Model</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((vehicle, index) => (
            <tr key={index}>
              <td>{vehicle.registration}</td>

              <td>{vehicle.model}</td>

              <td>{vehicle.type}</td>

              <td>{vehicle.capacity}</td>

              <td>{vehicle.status}</td>

              <td>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleTable;
