// ===================================================================
// 📋 CONTENIDO DE CITAS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Contenido principal que alterna entre calendario y tabla

import React from 'react';
import { DataTable } from '../../components/common';
import AppointmentCalendar from '../../components/appointments/AppointmentCalendar';
import { APPOINTMENTS_TABLE_COLUMNS } from '../../constants/appointments';

const AppointmentsContent = ({
  showCalendar,
  filteredAppointments,
  tableColumns
}) => {
  if (showCalendar) {
    return <AppointmentCalendar />;
  }

  return (
    <DataTable
      data={filteredAppointments}
      columns={tableColumns}
      searchable
      emptyMessage={APPOINTMENTS_TABLE_COLUMNS.EMPTY_MESSAGE}
    />
  );
};

export default AppointmentsContent;