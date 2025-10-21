import { FiCheck, FiCheckCircle, FiStar, FiBriefcase, FiScissors, FiAward } from 'react-icons/fi';

/**
 * Paso 4: Selección de Barbero
 */
const BarberSelection = ({ barbers, selectedBarberId, onSelectBarber }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Elige tu barbero
        </h3>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {barbers.map(barber => {
            const isSelected = selectedBarberId === barber.id;
            return (
              <div
                key={barber.id}
                onClick={() => onSelectBarber(barber.id)}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? 'border-primary-600 bg-primary-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Header del barbero */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-16 h-16 mr-4 font-bold text-white rounded-full bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg">
                      {barber.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{barber.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FiBriefcase className="w-4 h-4 mr-1" />
                        {barber.experience || 'Barbero profesional'}
                      </p>
                      <div className="flex items-center mt-2">
                        <FiStar className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-gray-700">{barber.rating || '4.8'}</span>
                        <span className="text-xs text-gray-500 ml-2">({barber.totalServices || 1000}+ servicios)</span>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-primary-600 rounded-full p-2">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Descripción */}
                {barber.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 italic">
                      "{barber.description}"
                    </p>
                  </div>
                )}

                {/* Especialidades */}
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <FiScissors className="w-4 h-4 mr-1" />
                    Especialidades
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {(barber.specialties || ['Corte', 'Barba']).map((specialty, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Logros y experiencia */}
                {barber.achievements && barber.achievements.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                      <FiAward className="w-4 h-4 mr-1 text-yellow-600" />
                      Logros destacados
                    </h5>
                    <div className="space-y-1">
                      {barber.achievements.slice(0, 3).map((achievement, index) => (
                        <div key={index} className="flex items-start text-xs text-gray-600">
                          <span className="w-1 h-1 bg-primary-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span>{achievement}</span>
                        </div>
                      ))}
                      {barber.achievements.length > 3 && (
                        <div className="text-xs text-primary-600 font-medium">
                          +{barber.achievements.length - 3} logros más
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Indicador de selección */}
                {isSelected && (
                  <div className="mt-4 p-3 bg-primary-100 rounded-lg">
                    <div className="flex items-center text-sm text-primary-700">
                      <FiCheckCircle className="w-4 h-4 mr-2" />
                      <span className="font-medium">Barbero seleccionado</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BarberSelection;
