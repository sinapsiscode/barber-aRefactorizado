// ===================================================================
// ⚡ ACCIONES RÁPIDAS - COMPONENTE REUTILIZABLE
// ===================================================================
// Panel de acciones rápidas para dashboards
import React from 'react';
import * as Icons from 'react-icons/fi';
import { Button } from '../../common';
import { DASHBOARD_SECTIONS } from '../../../constants';

const QuickActions = ({
  actions = [],
  onActionClick,
  title = DASHBOARD_SECTIONS.QUICK_ACTIONS,
  columns = 2
}) => {
  const gridClass = `grid grid-cols-1 md:grid-cols-${columns} gap-4`;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>

      <div className={gridClass}>
        {actions.map((action, index) => {
          const Icon = Icons[action.icon] || Icons.FiActivity;

          return (
            <Button
              key={index}
              variant="outline"
              onClick={() => onActionClick(action.action, action)}
              className={`${action.color} text-white border-transparent justify-start h-12 px-4`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;