// ===================================================================
// ⏰ CONTROLES DE ASISTENCIA - COMPONENTE ESPECIALIZADO
// ===================================================================
// Controles de check-in, check-out y ausencia temporal para barberos
import React from 'react';
import * as Icons from 'react-icons/fi';
import { Button } from '../../common';

const AttendanceControls = ({
  isCheckedIn,
  isTemporarilyAbsent,
  barberStatus,
  quickActions,
  onActionClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {quickActions.map((action, index) => {
        const Icon = Icons[action.icon] || Icons.FiActivity;

        return (
          <Button
            key={index}
            onClick={() => onActionClick(action.action, action)}
            disabled={action.disabled}
            className={`${action.color} text-white border-transparent justify-center h-16 px-4 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-gray-500`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Icon className="h-8 w-8" />
              <span className="text-xl font-semibold">{action.label}</span>
            </div>
          </Button>
        );
      })}

      {/* Estado actual del barbero */}
      <div className={`card ${barberStatus.bgColor}`}>
        <div className="flex items-center justify-center space-x-3 py-4">
          <Icons.FiActivity className="h-8 w-8 text-gray-600 dark:text-gray-400" />
          <div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Estado:
            </span>
            <span className={`ml-2 text-lg font-bold ${barberStatus.color}`}>
              {barberStatus.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceControls;