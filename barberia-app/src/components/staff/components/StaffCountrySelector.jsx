// ===================================================================
// 🌍 SELECTOR DE PAÍS - COMPONENTE ESPECIALIZADO
// ===================================================================
// Selector de país de origen con banderas

import React from 'react';
import CountryFlag from '../../common/CountryFlag';
import { STAFF_LABELS, STAFF_COUNTRIES } from '../../../constants/staff';

const StaffCountrySelector = ({
  selectedCountry,
  onCountryChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {STAFF_LABELS.FORM.COUNTRY}
      </label>
      <div className="relative">
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="input-field pl-12"
          required
        >
          {STAFF_COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <CountryFlag countryCode={selectedCountry} size={20} />
        </div>
      </div>
    </div>
  );
};

export default StaffCountrySelector;