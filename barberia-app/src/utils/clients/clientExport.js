/**
 * Utilidades para exportación de datos de clientes
 */

/**
 * Exporta la lista de clientes "no gratos" a un archivo JSON
 * @param {Array} unwelcomeClients - Lista de clientes unwelcome
 * @returns {void}
 */
export const exportUnwelcomeClients = (unwelcomeClients) => {
  try {
    // Mapear datos a formato exportable
    const unwelcomeData = unwelcomeClients.map(client => ({
      nombre: client.name || 'Sin nombre',
      email: client.email || 'Sin email',
      telefono: client.phone || 'Sin teléfono',
      motivo: client.unwelcomeReason || 'Sin motivo especificado',
      fechaMarcado: client.unwelcomeDate
        ? new Date(client.unwelcomeDate).toLocaleDateString('es-PE')
        : 'Desconocida',
      totalGastado: client.totalSpent || 0,
      ultimaVisita: client.lastVisit
        ? new Date(client.lastVisit).toLocaleDateString('es-PE')
        : 'Nunca'
    }));

    // Convertir a JSON con formato legible
    const dataStr = JSON.stringify(unwelcomeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    // Crear nombre de archivo con fecha actual
    const fecha = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `clientes_no_gratos_${fecha}.json`;

    // Crear link de descarga temporal
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpiar URL object
    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error('Error al exportar clientes no gratos:', error);
    return false;
  }
};

/**
 * Exporta todos los clientes a CSV
 * @param {Array} clients - Lista de clientes
 * @returns {void}
 */
export const exportClientsToCSV = (clients) => {
  try {
    // Headers del CSV
    const headers = [
      'ID',
      'Nombre',
      'Email',
      'Teléfono',
      'Total Gastado',
      'Visitas',
      'Puntos',
      'Última Visita',
      'Estado'
    ];

    // Convertir datos a filas CSV
    const rows = clients.map(client => [
      client.id,
      `"${client.name || ''}"`,
      client.email || '',
      client.phone || '',
      client.totalSpent || 0,
      client.totalVisits || 0,
      client.loyaltyPoints || 0,
      client.lastVisit
        ? new Date(client.lastVisit).toLocaleDateString('es-PE')
        : 'Nunca',
      client.isUnwelcome
        ? 'No Grato'
        : client.status === 'blacklisted'
        ? 'Bloqueado'
        : 'Activo'
    ]);

    // Construir CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Crear Blob con BOM para Excel
    const BOM = '\uFEFF';
    const dataBlob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    // Crear nombre de archivo
    const fecha = new Date().toISOString().split('T')[0];
    const filename = `clientes_${fecha}.csv`;

    // Descargar
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error('Error al exportar clientes a CSV:', error);
    return false;
  }
};

/**
 * Exporta clientes VIP a JSON
 * @param {Array} vipClients - Lista de clientes VIP
 * @returns {void}
 */
export const exportVIPClients = (vipClients) => {
  try {
    const vipData = vipClients.map(client => ({
      nombre: client.name,
      email: client.email,
      telefono: client.phone,
      totalGastado: client.totalSpent,
      totalVisitas: client.totalVisits,
      puntosLealtad: client.loyaltyPoints,
      ultimaVisita: client.lastVisit
        ? new Date(client.lastVisit).toLocaleDateString('es-PE')
        : 'Nunca',
      tier: client.totalSpent >= 1000000
        ? 'Platinum'
        : client.totalSpent >= 500000
        ? 'Gold'
        : 'Silver'
    }));

    const dataStr = JSON.stringify(vipData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const fecha = new Date().toISOString().split('T')[0];
    const filename = `clientes_vip_${fecha}.json`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);

    return true;
  } catch (error) {
    console.error('Error al exportar clientes VIP:', error);
    return false;
  }
};
