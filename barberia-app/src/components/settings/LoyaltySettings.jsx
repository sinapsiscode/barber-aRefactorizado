import { useState } from 'react';
import { useLoyaltySettingsForm } from '../../hooks/loyaltySettings/useLoyaltySettingsForm';
import { useLoyaltyStats } from '../../hooks/loyaltySettings/useLoyaltyStats';
import { useLoyaltyLevelsManagement } from '../../hooks/loyaltySettings/useLoyaltyLevelsManagement';
import { LOYALTY_SECTIONS } from '../../constants/loyaltySettings';
import LoyaltyHeader from './loyaltySettings/LoyaltyHeader';
import PointsStats from './loyaltySettings/basic/PointsStats';
import SystemStatus from './loyaltySettings/basic/SystemStatus';
import PointsConfig from './loyaltySettings/basic/PointsConfig';
import BonusesConfig from './loyaltySettings/basic/BonusesConfig';
import CalculationExample from './loyaltySettings/basic/CalculationExample';
import LevelsSummaryCards from './loyaltySettings/levels/LevelsSummaryCards';
import LevelsDetailedList from './loyaltySettings/levels/LevelsDetailedList';
import LoyaltyLevelForm from './LoyaltyLevelForm';

/**
 * LoyaltySettings Refactorizado
 * Reducido de 624 líneas a ~95 líneas
 *
 * Funcionalidades:
 * - Configuración básica del sistema de puntos
 * - Gestión de niveles de lealtad (CRUD)
 * - Estadísticas de puntos
 * - Bonificaciones especiales
 * - Ejemplo de cálculo
 */
const LoyaltySettings = () => {
  const [activeSection, setActiveSection] = useState(LOYALTY_SECTIONS.BASIC);

  // Hooks personalizados
  const {
    formData,
    saving,
    hasChanges,
    handleInputChange,
    handleSave,
    handleReset
  } = useLoyaltySettingsForm();

  const {
    totalEarned,
    totalRedeemed,
    totalActive
  } = useLoyaltyStats();

  const {
    loyaltyLevels,
    clientsByLevel,
    showLevelForm,
    selectedLevel,
    handleEditLevel,
    handleNewLevel,
    handleCloseLevelForm,
    handleDeleteLevel
  } = useLoyaltyLevelsManagement();

  return (
    <div className="space-y-6">
      {/* Header con tabs y botones de acción */}
      <LoyaltyHeader
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        hasChanges={hasChanges}
        saving={saving}
        onSave={handleSave}
        onReset={handleReset}
        onNewLevel={handleNewLevel}
      />

      {/* Contenido de la sección BASIC */}
      {activeSection === LOYALTY_SECTIONS.BASIC && (
        <>
          {/* Estado del Sistema */}
          <SystemStatus
            enabled={formData.enabled}
            onToggle={handleInputChange}
          />

          {/* Estadísticas de Puntos */}
          <PointsStats
            totalEarned={totalEarned}
            totalRedeemed={totalRedeemed}
            totalActive={totalActive}
          />

          {/* Configuración Principal */}
          <PointsConfig
            formData={formData}
            onChange={handleInputChange}
          />

          {/* Bonificaciones Especiales */}
          <BonusesConfig
            formData={formData}
            onChange={handleInputChange}
          />

          {/* Ejemplo de Cálculo */}
          <CalculationExample formData={formData} />
        </>
      )}

      {/* Contenido de la sección LEVELS */}
      {activeSection === LOYALTY_SECTIONS.LEVELS && (
        <>
          {/* Resumen de Niveles */}
          <LevelsSummaryCards
            loyaltyLevels={loyaltyLevels}
            clientsByLevel={clientsByLevel}
          />

          {/* Lista Detallada de Niveles */}
          <LevelsDetailedList
            loyaltyLevels={loyaltyLevels}
            clientsByLevel={clientsByLevel}
            onEdit={handleEditLevel}
            onDelete={handleDeleteLevel}
          />
        </>
      )}

      {/* Modal del formulario de nivel */}
      {showLevelForm && (
        <LoyaltyLevelForm
          level={selectedLevel}
          onClose={handleCloseLevelForm}
          onSuccess={handleCloseLevelForm}
        />
      )}
    </div>
  );
};

export default LoyaltySettings;
