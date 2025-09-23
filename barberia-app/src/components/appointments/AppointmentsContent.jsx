import React from 'react';
import DataTable from '../common/DataTable';
import AppointmentCalendar from './AppointmentCalendar';
import { APPOINTMENTS_TABLE_COLUMNS } from '../../constants/appointments';

const AppointmentsContent = ({ showCalendar, filteredAppointments, columns }) => {
  if (showCalendar) {
    return <AppointmentCalendar />;
  }

  return (
    <DataTable
      data={filteredAppointments}
      columns={columns}
      searchable
      emptyMessage={APPOINTMENTS_TABLE_COLUMNS.EMPTY_MESSAGE}
    />
  );
};

export default AppointmentsContent;