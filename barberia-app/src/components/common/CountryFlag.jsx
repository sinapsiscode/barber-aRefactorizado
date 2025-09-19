import { URLS } from '../../constants';

const COUNTRY_NAMES = {
  PE: 'Perú',
  CO: 'Colombia',
  CL: 'Chile',
  AR: 'Argentina',
  EC: 'Ecuador',
  BO: 'Bolivia',
  VE: 'Venezuela',
  UY: 'Uruguay',
  PY: 'Paraguay',
  BR: 'Brasil',
  MX: 'México',
  US: 'Estados Unidos',
  ES: 'España'
};

const CountryFlag = ({ country, countryCode, size = 16, showName = false }) => {
  // Permitir tanto 'country' como 'countryCode' como props
  const code = country || countryCode;

  // Si no hay código, no renderizar nada
  if (!code) {
    return null;
  }

  // Usar URL centralizada desde constants
  const flagUrl = `${URLS.FLAG_API}${code.toLowerCase()}.png`;

  return (
    <span className="inline-flex items-center space-x-1">
      <img 
        src={flagUrl}
        alt={`${COUNTRY_NAMES[code] || code} flag`}
        width={size}
        height={size * 0.75} // Proporción típica de banderas
        className="rounded-sm object-cover"
        onError={(e) => {
          // Fallback si la imagen no carga
          e.target.style.display = 'none';
          e.target.nextSibling.textContent = code;
        }}
      />
      <span className="hidden"></span> {/* Para el fallback */}
      {showName && <span>{COUNTRY_NAMES[code] || code}</span>}
    </span>
  );
};

export default CountryFlag;