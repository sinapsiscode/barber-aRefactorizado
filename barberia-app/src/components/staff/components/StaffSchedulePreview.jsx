// ===================================================================
// 📅 VISTA PREVIA DE HORARIO - COMPONENTE ESPECIALIZADO
// ===================================================================
// Vista previa del horario por defecto del barbero

import React from 'react';
import { STAFF_LABELS, STAFF_STYLES } from '../../../constants/staff';

const StaffSchedulePreview = () => {
  return (
    <div className={STAFF_STYLES.SCHEDULE.CONTAINER}>
      <h4 className={STAFF_STYLES.SCHEDULE.TITLE}>
        {STAFF_LABELS.SCHEDULE.TITLE}
      </h4>

      <div className={STAFF_STYLES.SCHEDULE.GRID}>
        <div className={STAFF_STYLES.SCHEDULE.ROW}>
          <span className={STAFF_STYLES.SCHEDULE.LABEL}>
            {STAFF_LABELS.SCHEDULE.WEEKDAYS}
          </span>
          <span>{STAFF_LABELS.SCHEDULE.WEEKDAYS_HOURS}</span>
        </div>

        <div className={STAFF_STYLES.SCHEDULE.ROW}>
          <span className={STAFF_STYLES.SCHEDULE.LABEL}>
            {STAFF_LABELS.SCHEDULE.SATURDAY}
          </span>
          <span>{STAFF_LABELS.SCHEDULE.SATURDAY_HOURS}</span>
        </div>

        <div className={STAFF_STYLES.SCHEDULE.ROW}>
          <span className={STAFF_STYLES.SCHEDULE.LABEL}>
            {STAFF_LABELS.SCHEDULE.SUNDAY}
          </span>
          <span>{STAFF_LABELS.SCHEDULE.SUNDAY_HOURS}</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {STAFF_LABELS.FORM.SCHEDULE_HELP}
      </p>
    </div>
  );
};

export default StaffSchedulePreview;