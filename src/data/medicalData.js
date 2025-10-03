
// Intervalos en meses para vacunas
export const vaccineTypes = [
  { name: "Rabia", initialIntervalMonths: 12, subsequentIntervalMonths: 12, description: "Protege contra el virus de la rabia." },
  { name: "Triple Felina (FVRCP)", initialIntervalMonths: 12, subsequentIntervalMonths: 12, description: "Protege contra Rinotraqueitis, Calicivirus y Panleucopenia." },
  { name: "Leucemia Felina (FeLV)", initialIntervalMonths: 12, subsequentIntervalMonths: 12, description: "Recomendada para gatos con acceso al exterior o en contacto con otros gatos." },

  { name: "Peritonitis Infecciosa Felina (PIF)", initialIntervalMonths: 12, subsequentIntervalMonths: 12, description: "Vacuna para la Peritonitis Infecciosa Felina." },
  { name: "Clamidia (Chlamydophila)", initialIntervalMonths: 12, subsequentIntervalMonths: 12, description: "Vacuna contra Chlamydophila felis." },
];

// Intervalos en meses para desparasitaciones
export const dewormingTypes = [
  { name: "Amplio Espectro (Interna y Externa)", intervalMonthsIndoor: 6, intervalMonthsOutdoor: 3, description: "Protección contra parásitos internos y externos (pulgas, garrapatas)." },
  { name: "Parásitos Intestinales", intervalMonthsIndoor: 6, intervalMonthsOutdoor: 3, description: "Específica para gusanos redondos y planos." },
  { name: "Prevención de Pulgas/Garrapatas", intervalMonthsIndoor: 6, intervalMonthsOutdoor: 1, description: "Producto tópico o oral para control de ectoparásitos." },
  
];

/**
 * Calcula la fecha de la próxima dosis.
 * @param {string} lastDateString - La fecha de la última dosis en formato 'YYYY-MM-DD'.
 * @param {number} intervalMonths - El intervalo en meses para la próxima dosis.
 * @returns {string} La fecha de la próxima dosis en formato 'YYYY-MM-DD'.
 */
export const calculateNextDueDate = (lastDateString, intervalMonths) => {
  if (!lastDateString || !intervalMonths) {
    return '';
  }
  const lastDate = new Date(lastDateString);
  const nextDate = new Date(lastDate);
  nextDate.setMonth(lastDate.getMonth() + intervalMonths);

  // Ajuste para el fin de mes: si la fecha original era fin de mes (ej. 31 enero)
  // y el siguiente mes no tiene tantos días (ej. 28 febrero), setMonth ajustará al 28.
  // Aseguramos que la fecha resultante sea válida (no se pase al siguiente mes si se ajustó).
  if (nextDate.getDate() !== lastDate.getDate() && nextDate.getDate() < lastDate.getDate()) {
      nextDate.setDate(0); // Va al último día del mes anterior
  }

  return nextDate.toISOString().split('T')[0];
};