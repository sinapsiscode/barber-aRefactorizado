// ===================================================================
// ✂️ HEADER DE BARBERO - COMPONENTE ESPECIALIZADO
// ===================================================================
// Header especializado para el dashboard del barbero con reloj y estado
import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import CountryFlag from '../../common/CountryFlag';
import { Button } from '../../common';

const BarberHeader = ({
  title,
  subtitle,
  gradient,
  currentTime,
  checkInTime,
  isCheckedIn,
  countryCode = 'PE',
  onRefresh,
  loading = false
}) => {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-lg p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold">{title}</h1>
            <CountryFlag countryCode={countryCode} size={24} />
          </div>
          <p className="text-white/80">{subtitle}</p>
        </div>

        <div className="text-right">
          <div className="text-4xl font-mono font-bold">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-white/60 text-sm mt-1 flex items-center space-x-4">
            <span>
              {isCheckedIn
                ? `Entrada: ${checkInTime?.toLocaleTimeString() || '--'}`
                : 'No has marcado entrada'
              }
            </span>
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
    </div>
  );
};

export default BarberHeader;