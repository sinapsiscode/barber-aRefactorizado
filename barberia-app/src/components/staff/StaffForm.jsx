import { useState } from 'react';
import { FiX, FiUser, FiMail, FiPhone, FiMapPin, FiFlag, FiCalendar, FiClock, FiAward, FiPlus, FiTrash } from 'react-icons/fi';
import { useStaffStore, useBranchStore } from '../../stores';
import { FormInput } from '../common';
import CountryFlag from '../common/CountryFlag';

const StaffForm = ({ barber = null, onClose, onSuccess }) => {
  const { addBarber, updateBarber } = useStaffStore();
  const { branches } = useBranchStore();
  
  const [formData, setFormData] = useState({
    name: barber?.name || '',
    email: barber?.email || '',
    phone: barber?.phone || '',
    branchId: barber?.branchId || 1,
    specialties: barber?.specialties || [],
    experience: barber?.experience || '',
    commission: barber?.commission || 0.7,
    country: barber?.country || 'PE',
    birthDate: barber?.birthDate || '',
    schedule: barber?.schedule || {
      monday: { start: '08:00', end: '18:00', isWorking: true },
      tuesday: { start: '08:00', end: '18:00', isWorking: true },
      wednesday: { start: '08:00', end: '18:00', isWorking: true },
      thursday: { start: '08:00', end: '18:00', isWorking: true },
      friday: { start: '08:00', end: '18:00', isWorking: true },
      saturday: { start: '08:00', end: '16:00', isWorking: true },
      sunday: { start: '10:00', end: '14:00', isWorking: false }
    },
    achievements: barber?.achievements || []
  });
  
  const [loading, setLoading] = useState(false);

  const availableSpecialties = [
    'Corte Clásico',
    'Fade Moderno',
    'Barba',
    'Diseño Especial',
    'Tinte',
    'Cejas',
    'Afeitado Tradicional',
    'Tratamientos Capilares'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar edad mínima de 18 años
      if (formData.birthDate) {
        const today = new Date();
        const birthDate = new Date(formData.birthDate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 18) {
          alert('El barbero debe ser mayor de 18 años');
          setLoading(false);
          return;
        }
      }

      if (barber) {
        await updateBarber(barber.id, formData);
      } else {
        await addBarber(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving barber:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtyToggle = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleScheduleChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value
        }
      }
    }));
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, '']
    }));
  };

  const removeAchievement = (index) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const updateAchievement = (index, value) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) =>
        i === index ? value : achievement
      )
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white dark:bg-dark-800 px-6 py-4 border-b border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {barber ? 'Editar Barbero' : 'Nuevo Barbero'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nombre Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                icon={FiUser}
                required
                placeholder="Juan Pérez"
              />
              
              <FormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                icon={FiMail}
                required
                placeholder="juan@barberia.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Teléfono"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                icon={FiPhone}
                required
                placeholder="+57 300 123 4567"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sede
                </label>
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: parseInt(e.target.value) })}
                  className="input-field"
                  required
                >
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} - {branch.city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                País de Origen
              </label>
              <div className="relative">
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="input-field pl-12"
                  required
                >
                  <option value="PE">Perú</option>
                  <option value="CO">Colombia</option>
                  <option value="VE">Venezuela</option>
                  <option value="AR">Argentina</option>
                  <option value="CL">Chile</option>
                  <option value="EC">Ecuador</option>
                  <option value="BO">Bolivia</option>
                  <option value="UY">Uruguay</option>
                  <option value="PY">Paraguay</option>
                  <option value="BR">Brasil</option>
                  <option value="MX">México</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CountryFlag countryCode={formData.country} size={20} />
                </div>
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <FormInput
                label="Fecha de Nacimiento"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                icon={FiCalendar}
                required
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              />
              <p className="text-xs text-gray-500 mt-1">
                Debe ser mayor de 18 años
              </p>
            </div>

            {/* Experience and Commission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Experiencia"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="5 años"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Comisión (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: parseFloat(e.target.value) })}
                  className="input-field"
                  placeholder="0.70"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Porcentaje de comisión por servicio (0.70 = 70%)
                </p>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Especialidades
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSpecialties.map(specialty => (
                  <label
                    key={specialty}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.specialties.includes(specialty)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => handleSpecialtyToggle(specialty)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {specialty}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Selecciona las especialidades del barbero
              </p>
            </div>


            {/* Achievements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Logros y Reconocimientos
              </label>
              <div className="space-y-3">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="Ej: Mejor barbero del mes - Enero 2024"
                      className="flex-1 input-field"
                    />
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg"
                    >
                      <FiTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAchievement}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>Agregar Logro</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Agrega reconocimientos, certificaciones o logros destacados del barbero
              </p>
            </div>

            {/* Schedule Configuration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Horario de Trabajo
              </label>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 space-y-4">
                {Object.entries(formData.schedule).map(([day, schedule]) => {
                  const dayNames = {
                    monday: 'Lunes',
                    tuesday: 'Martes',
                    wednesday: 'Miércoles',
                    thursday: 'Jueves',
                    friday: 'Viernes',
                    saturday: 'Sábado',
                    sunday: 'Domingo'
                  };

                  return (
                    <div key={day} className="flex items-center justify-between p-3 bg-white dark:bg-dark-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={schedule.isWorking}
                            onChange={(e) => handleScheduleChange(day, 'isWorking', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="font-medium text-gray-900 dark:text-white min-w-[80px]">
                            {dayNames[day]}
                          </span>
                        </label>
                      </div>

                      {schedule.isWorking && (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <FiClock className="h-4 w-4 text-gray-500" />
                            <input
                              type="time"
                              value={schedule.start}
                              onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-dark-800"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                              type="time"
                              value={schedule.end}
                              onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                              className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-dark-800"
                            />
                          </div>
                        </div>
                      )}

                      {!schedule.isWorking && (
                        <div className="text-sm text-gray-500 italic">
                          Día de descanso
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Configura los días y horarios de trabajo del barbero
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || formData.specialties.length === 0}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Guardando...' : barber ? 'Actualizar' : 'Crear Barbero'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffForm;