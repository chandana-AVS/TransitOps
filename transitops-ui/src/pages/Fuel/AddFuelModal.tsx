import "./AddFuelModal.css";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddFuelModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="fuel-modal">
        <h2>Add Fuel Log</h2>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}