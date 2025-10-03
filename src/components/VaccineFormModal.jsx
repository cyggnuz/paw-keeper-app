import React, { useState, useEffect } from 'react';
import './VaccineFormModal.css';
import { vaccineTypes, calculateNextDueDate } from '../data/medicalData';

const VaccineFormModal = ({ petId, vaccineToEdit, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    nextDueDate: '',
    notes: '',
  });

  useEffect(() => {
    if (vaccineToEdit) {
      setFormData({
        name: vaccineToEdit.name || '',
        date: vaccineToEdit.date || '',
        nextDueDate: vaccineToEdit.nextDueDate || '',
        notes: vaccineToEdit.notes || '',
      });
    } else {
      setFormData({
        name: '',
        date: '',
        nextDueDate: '',
        notes: '',
      });
    }
  }, [vaccineToEdit]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      let updatedData = {
        ...prevData,
        [name]: value,
      };

      
      if (name === 'name' || name === 'date') {
        const selectedVaccineType = vaccineTypes.find(v => v.name === updatedData.name);
        if (selectedVaccineType && updatedData.date) {

          updatedData.nextDueDate = calculateNextDueDate(
            updatedData.date,
            selectedVaccineType.subsequentIntervalMonths
          );
        } else {
          updatedData.nextDueDate = '';
        }
      }
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date) {
      alert('Por favor, ingresa el nombre y la fecha de la vacuna.');
      return;
    }
    onSave(petId, formData);
  };

  return (
    <div className="vaccine-form-modal-overlay">
      <div className="vaccine-modal-content">
        <h2>{vaccineToEdit ? 'Editar Vacuna' : 'Añadir Nueva Vacuna'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre de la Vacuna:</label>
            <select
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una vacuna</option>
              {vaccineTypes.map((vaccine) => (
                <option key={vaccine.name} value={vaccine.name}>
                  {vaccine.name}
                </option>
              ))}
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
              readOnly 
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
              {vaccineToEdit ? 'Guardar Cambios' : 'Añadir Vacuna'}
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

export default VaccineFormModal;