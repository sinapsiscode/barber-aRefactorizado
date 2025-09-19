// ===================================================================
// 👥 FORMULARIO DE PERSONAL - REFACTORIZADO
// ===================================================================
// Formulario modal para creación y edición de barberos

import React from 'react';
import { useStaffForm } from '../../hooks/useStaffForm';
import { STAFF_STYLES } from '../../constants/staff';
import {
  StaffFormHeader,
  StaffBasicInfo,
  StaffBranchSelector,
  StaffCountrySelector,
  StaffExperienceCommission,
  StaffSpecialties,
  StaffSchedulePreview,
  StaffFormActions
} from './components';

const StaffForm = ({ barber = null, onClose, onSuccess }) => {
  const {
    // Estados
    formData,
    loading,
    isEditing,
    isFormValid,

    // Datos computados
    branches,
    getCommissionValidation,

    // Funciones
    updateField,
    handleSpecialtyToggle,
    handleSubmit,
    handleClose
  } = useStaffForm(barber, onSuccess, onClose);

  return (
    <div className={STAFF_STYLES.MODAL.OVERLAY}>
      <div className={STAFF_STYLES.MODAL.CONTAINER}>
        <div className={STAFF_STYLES.MODAL.BACKDROP} aria-hidden="true">
          <div className={STAFF_STYLES.MODAL.BACKDROP_BG} onClick={handleClose} />
        </div>

        <div className={STAFF_STYLES.MODAL.CONTENT}>
          <StaffFormHeader
            isEditing={isEditing}
            onClose={handleClose}
          />

          <form onSubmit={handleSubmit} className={STAFF_STYLES.FORM.CONTAINER}>
            {/* Información básica */}
            <StaffBasicInfo
              formData={formData}
              onFieldChange={updateField}
            />

            {/* Sede y país */}
            <div className={STAFF_STYLES.FORM.GRID_2}>
              <StaffBranchSelector
                selectedBranchId={formData.branchId}
                branches={branches}
                onBranchChange={(value) => updateField('branchId', value)}
              />
            </div>

            <StaffCountrySelector
              selectedCountry={formData.country}
              onCountryChange={(value) => updateField('country', value)}
            />

            {/* Experiencia y comisión */}
            <StaffExperienceCommission
              formData={formData}
              commissionValidation={getCommissionValidation}
              onFieldChange={updateField}
            />

            {/* Especialidades */}
            <StaffSpecialties
              selectedSpecialties={formData.specialties}
              onSpecialtyToggle={handleSpecialtyToggle}
            />

            {/* Vista previa de horario */}
            <StaffSchedulePreview />

            {/* Acciones */}
            <StaffFormActions
              isEditing={isEditing}
              loading={loading}
              isFormValid={isFormValid}
              onCancel={handleClose}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffForm;