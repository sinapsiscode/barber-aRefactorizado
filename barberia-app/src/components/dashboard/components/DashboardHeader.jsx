// ===================================================================
// 📊 HEADER DE DASHBOARD - COMPONENTE REUTILIZABLE
// ===================================================================
// Header común para todos los tipos de dashboard
import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { Button } from '../../common';

const DashboardHeader = ({
  title,
  subtitle,
  gradient,
  onRefresh,
  loading = false,
  lastUpdated,
  actions = []
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-white/80">{subtitle}</p>

          {lastUpdated && (
            <p className="text-xs text-white/60 mt-2">
              Última actualización: {lastUpdated}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="text-white border-white/30 hover:bg-white/10"
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
            className="text-white border-white/30 hover:bg-white/10"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;