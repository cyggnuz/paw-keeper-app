import React, { useState } from 'react';
import './PetCard.css';

/**
 * Componente funcional PetCard para mostrar la información de una mascota.
 * Incluye funcionalidades para ver detalles, marcar comidas, editar y eliminar.
 *
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.mascota - El objeto de la mascota a mostrar.
 * @param {function} props.onToggleComida - Callback para cambiar el estado de la comida.
 * @param {function} props.onEditPet - Callback para iniciar la edición de la mascota.
 * @param {function} props.onDeletePet - Callback para eliminar la mascota.
 * @param {string} [props.mode='full'] - Modo de la tarjeta: 'full' para la vista principal, 'selection' para selección de historial. // CAMBIO: Nuevo prop
 * @param {function} [props.onSelectPet] - Callback para cuando se selecciona una mascota en modo 'selection'. // CAMBIO: Nuevo prop
 * @param {string|null} [props.currentSelectedPetId] - ID de la mascota actualmente seleccionada para resaltar. // CAMBIO: Nuevo prop
 */
function PetCard({
  mascota,
  onToggleComida,
  onEditPet,
  onDeletePet,
  mode = 'full', 
  onSelectPet, 
  currentSelectedPetId 
}) {

  const [showDetails, setShowDetails] = useState(false);
 
  const [showActionsMenu, setShowActionsMenu] = useState(false);

 
  const toggleDetails = () => {
    if (mode === 'full') {
      setShowDetails(!showDetails);
      setShowActionsMenu(false); 
    }
  };

  /**
   * @param {Event} e 
   */
  const toggleActionsMenu = (e) => {
    e.stopPropagation(); 
    setShowActionsMenu(!showActionsMenu);
  };

  /**
   * @param {function} actionFunction 
   * @param {...any} args 
   */
  const handleAction = (actionFunction, ...args) => {
    actionFunction(...args); 
    setShowActionsMenu(false); 
  };

 
  const porcionesComidasHoy = mascota.historialAlimentacion
    ? mascota.historialAlimentacion.filter(dosis => dosis.marcado).length
    : 0;

  const totalPorcionesEsperadas = mascota.vecesComidaEstimado || 1;
  const progresoPorcentaje = (porcionesComidasHoy / totalPorcionesEsperadas) * 100;


  const today = new Date().toISOString().split('T')[0];
  const proximaDosisIndex = mascota.historialAlimentacion
    ? mascota.historialAlimentacion.findIndex(dosis => dosis.fecha === today && !dosis.marcado)
    : -1;

  const handleMarcarProximaComida = () => {
    if (proximaDosisIndex !== -1) {
      onToggleComida(mascota.id, proximaDosisIndex);
    }
  };

  const puedeMarcarComida = proximaDosisIndex !== -1;
  const estaCompletado = porcionesComidasHoy === totalPorcionesEsperadas;

 
  const cantidadPorcionGramos = mascota.historialAlimentacion && mascota.historialAlimentacion.length > 0
    ? mascota.historialAlimentacion[0].cantidadGramos
    : 0;
  const racionDiariaTotalEstimada = cantidadPorcionGramos * totalPorcionesEsperadas;

  
  const handleCardClick = () => {
    if (mode === 'selection' && onSelectPet) {
      onSelectPet(mascota.id); 
    } else if (mode === 'full') {
      toggleDetails(); 
    }
  };

  
  const isSelectedForHistory = mode === 'selection' && currentSelectedPetId === mascota.id;

  return (
    <div className={`pet-card ${mode === 'selection' ? 'pet-selection-card' : ''} ${isSelectedForHistory ? 'selected-for-history-view' : ''}`}
         onClick={handleCardClick}
    >
      {/* Lógica para la imagen del avatar. Usa mascota.iconoRaza si existe, sino, un default. */}
      <img
        src={mascota.iconoRaza || "/cat_avatar.png"} 
        alt={mascota.nombre || "Mascota"} 
        className="pet-icon"
      />
      {/* onClick en h3.pet-name ahora llama a handleCardClick */}
      <h3 className="pet-name" onClick={handleCardClick}>{mascota.nombre}</h3>
      <p className="pet-breed">{mascota.raza}</p>

      {/* CAMBIO: Renderizado condicional de elementos específicos del modo 'full' */}
      {mode === 'full' && (
        <>
          {/* Sección de estado de alimentación simplificada */}
          <div className="pet-food-status-simplified">
            <p className="food-status-text">
              {estaCompletado
                ? `¡Completó sus ${totalPorcionesEsperadas} comidas (${racionDiariaTotalEstimada}g) de hoy!`
                : `Hoy ha comido ${porcionesComidasHoy} de ${totalPorcionesEsperadas} porciones (${racionDiariaTotalEstimada}g).`}
            </p>
            <button
              onClick={handleMarcarProximaComida}
              disabled={!puedeMarcarComida}
              className="mark-food-button"
            >
              {estaCompletado ? "Completado" : "Marcar próxima comida"}
            </button>
          </div>

          {/* Barra de progreso de alimentación */}
          <div className="food-progress-container">
            <div className="food-progress-bar" style={{ width: `${progresoPorcentaje}%` }}></div>
            <div className="food-progress-text">{`${porcionesComidasHoy}/${totalPorcionesEsperadas} comidas`}</div>
          </div>

          {/* Contenedor del menú de 3 puntitos */}
          <div className="pet-card-options-toggle">
            <button className="options-button" onClick={toggleActionsMenu}>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </button>
            {showActionsMenu && (
              <div className="options-menu">
                <button onClick={() => handleAction(onEditPet, mascota)}>Editar</button>
                <button onClick={() => handleAction(onDeletePet, mascota.id)}>Eliminar</button>
              </div>
            )}
          </div>

          {/* Los detalles adicionales de la mascota se muestran condicionalmente */}
          {showDetails && (
            <div className="pet-details-dropdown">
              <p><strong>Peso:</strong> {mascota.peso} kg</p>
              <p><strong>Edad:</strong> {mascota.edad.anos} años, {mascota.edad.meses} meses</p>
              <p><strong>Ración diaria estimada:</strong> {racionDiariaTotalEstimada} gramos</p>
              {/* CAMBIO: Ajuste para mostrar correctamente vacunas y desparasitaciones si son objetos */}
              {mascota.historialVacunas && mascota.historialVacunas.length > 0 && (
                  <p><strong>Vacunas:</strong> {mascota.historialVacunas.map(v => v.nombreVacuna || v).join(', ')}</p>
              )}
              {mascota.historialDesparasitacion && mascota.historialDesparasitacion.length > 0 && (
                  <p><strong>Desparasitación:</strong> {mascota.historialDesparasitacion.map(d => d.nombreTratamiento || d).join(', ')}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PetCard;