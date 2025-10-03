import React, { useState, useEffect } from 'react';
import './DewormingFormModal.css';
import { dewormingTypes, calculateNextDueDate } from '../data/medicalData'; // ¡Importa los nuevos datos!

const DewormingFormModal = ({ petId, dewormingToEdit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '', // Tipo de desparasitación
    date: '',
    petType: '', // 'indoor', 'outdoor', 'mixed'
    nextDueDate: '',
    notes: '',
  });

  useEffect(() => {
    if (dewormingToEdit) {
      setFormData({
        name: dewormingToEdit.name || '',
        date: dewormingToEdit.date || '',
        petType: dewormingToEdit.petType || '', // Precarga el tipo de mascota
        nextDueDate: dewormingToEdit.nextDueDate || '',
        notes: dewormingToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        date: '',
        petType: '', // Reinicia para nueva desparasitación
        nextDueDate: '',
        notes: '',
      });
    }
  }, [dewormingToEdit]);

  // Función para recalcular la próxima fecha
  const recalculateNextDueDate = (currentData) => {
    const selectedDewormingType = dewormingTypes.find(d => d.name === currentData.name);
    if (selectedDewormingType && currentData.date && currentData.petType) {
      let interval = 0;
      if (currentData.petType === 'indoor') {
        interval = selectedDewormingType.intervalMonthsIndoor;
      } else if (currentData.petType === 'outdoor' || currentData.petType === 'mixed') {
        interval = selectedDewormingType.intervalMonthsOutdoor;
      }
      return calculateNextDueDate(currentData.date, interval);
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      let updatedData = {
        ...prevData,
        [name]: value,
      };

      // Recalcula nextDueDate si cambia el tipo de desparasitación, fecha o tipo de mascota
      if (name === 'name' || name === 'date' || name === 'petType') {
        updatedData.nextDueDate = recalculateNextDueDate(updatedData);
      }
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.petType) {
      alert('Por favor, selecciona el tipo de desparasitación, fecha y el tipo de mascota (Indoor/Outdoor).');
      return;
    }
    onSave(petId, formData);
  };

  return (
    <div className="deworming-form-modal-overlay">
      <div className="deworming-modal-content">
        <h2>{dewormingToEdit ? 'Editar Desparasitación' : 'Añadir Nueva Desparasitación'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Tipo de Desparasitación:</label>
            <select
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un tipo</option>
              {dewormingTypes.map((deworming) => (
                <option key={deworming.name} value={deworming.name}>
                  {deworming.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="petType">Tipo de Mascota (Indoor/Outdoor):</label>
            <select
              id="petType"
              name="petType"
              value={formData.petType}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona</option>
              <option value="indoor">Indoor (Solo interior)</option>
              <option value="outdoor">Outdoor (Con acceso al exterior)</option>
              <option value="mixed">Mixto (Interior y exterior)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Fecha de Administración:</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nextDueDate">Próxima Dosis (Fecha Estimada):</label>
            <input
              type="date"
              id="nextDueDate"
              name="nextDueDate"
              value={formData.nextDueDate}
              onChange={handleChange}
              readOnly // Campo de solo lectura, se calcula automáticamente
              title="Esta fecha se calcula automáticamente."
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes">Notas:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">
              {dewormingToEdit ? 'Guardar Cambios' : 'Añadir Desparasitación'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DewormingFormModal;