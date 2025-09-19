import React, { useState } from 'react';
import { FiFileText, FiShield, FiUsers, FiClock, FiDollarSign } from 'react-icons/fi';
import { TERMS_AND_CONDITIONS } from '../../constants/auth';
import { Modal, Button } from '../common';

const TermsAndConditions = ({ isOpen, onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      onClose();
    }
  };

  const renderHeader = () => (
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
        <FiFileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {TERMS_AND_CONDITIONS.TITLE}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {TERMS_AND_CONDITIONS.SUBTITLE}
        </p>
      </div>
    </div>
  );

  const renderWelcomeSection = () => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiUsers className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
        {TERMS_AND_CONDITIONS.SECTIONS.WELCOME.TITLE}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {TERMS_AND_CONDITIONS.SECTIONS.WELCOME.CONTENT}
      </p>
    </section>
  );

  const renderServicesSection = () => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {TERMS_AND_CONDITIONS.SECTIONS.SERVICES.TITLE}
      </h3>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        {TERMS_AND_CONDITIONS.SECTIONS.SERVICES.ITEMS.map((item, index) => (
          <p key={index}>• {item}</p>
        ))}
      </div>
    </section>
  );

  const renderAppointmentsSection = () => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiClock className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
        {TERMS_AND_CONDITIONS.SECTIONS.APPOINTMENTS.TITLE}
      </h3>
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
        <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
          {TERMS_AND_CONDITIONS.SECTIONS.APPOINTMENTS.IMPORTANT_TITLE}
        </h4>
        <div className="space-y-2 text-amber-700 dark:text-amber-300 text-sm">
          {TERMS_AND_CONDITIONS.SECTIONS.APPOINTMENTS.IMPORTANT_ITEMS.map((item, index) => (
            <p key={index}>• {item}</p>
          ))}
        </div>
      </div>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p><strong>Reserva:</strong> {TERMS_AND_CONDITIONS.SECTIONS.APPOINTMENTS.DETAILS.BOOKING}</p>
        <p><strong>Confirmación:</strong> {TERMS_AND_CONDITIONS.SECTIONS.APPOINTMENTS.DETAILS.CONFIRMATION}</p>
        <p><strong>Modificación:</strong> {TERMS_AND_CONDITIONS.SECTIONS.APPOINTMENTS.DETAILS.MODIFICATION}</p>
        <p><strong>Lista de espera:</strong> {TERMS_AND_CONDITIONS.SECTIONS.APPOINTMENTS.DETAILS.WAITLIST}</p>
      </div>
    </section>
  );

  const renderPaymentsSection = () => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiDollarSign className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
        {TERMS_AND_CONDITIONS.SECTIONS.PAYMENTS.TITLE}
      </h3>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        {TERMS_AND_CONDITIONS.SECTIONS.PAYMENTS.ITEMS.map((item, index) => (
          <p key={index}>• <strong>{item.split(':')[0]}:</strong>{item.split(':')[1]}</p>
        ))}
      </div>
    </section>
  );

  const renderPrivacySection = () => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiShield className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
        {TERMS_AND_CONDITIONS.SECTIONS.PRIVACY.TITLE}
      </h3>
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          {TERMS_AND_CONDITIONS.SECTIONS.PRIVACY.PROTECTION_TITLE}
        </h4>
        <div className="space-y-2 text-blue-700 dark:text-blue-300 text-sm">
          {TERMS_AND_CONDITIONS.SECTIONS.PRIVACY.PROTECTION_ITEMS.map((item, index) => (
            <p key={index}>• {item}</p>
          ))}
        </div>
      </div>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p><strong>Información recopilada:</strong> {TERMS_AND_CONDITIONS.SECTIONS.PRIVACY.DETAILS.COLLECTED}</p>
        <p><strong>Uso de datos:</strong> {TERMS_AND_CONDITIONS.SECTIONS.PRIVACY.DETAILS.USAGE}</p>
        <p><strong>Retención:</strong> {TERMS_AND_CONDITIONS.SECTIONS.PRIVACY.DETAILS.RETENTION}</p>
        <p><strong>Derechos:</strong> {TERMS_AND_CONDITIONS.SECTIONS.PRIVACY.DETAILS.RIGHTS}</p>
      </div>
    </section>
  );

  const renderResponsibilitiesSection = () => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {TERMS_AND_CONDITIONS.SECTIONS.RESPONSIBILITIES.TITLE}
      </h3>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        {TERMS_AND_CONDITIONS.SECTIONS.RESPONSIBILITIES.ITEMS.map((item, index) => (
          <p key={index}>• {item}</p>
        ))}
      </div>
    </section>
  );

  const renderLiabilitySection = () => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {TERMS_AND_CONDITIONS.SECTIONS.LIABILITY.TITLE}
      </h3>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        {TERMS_AND_CONDITIONS.SECTIONS.LIABILITY.ITEMS.map((item, index) => (
          <p key={index}>• {item}</p>
        ))}
      </div>
    </section>
  );

  const renderModificationsSection = () => (
    <section className="mb-8">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {TERMS_AND_CONDITIONS.SECTIONS.MODIFICATIONS.TITLE}
      </h3>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p>{TERMS_AND_CONDITIONS.SECTIONS.MODIFICATIONS.CONTENT}</p>
        <p>{TERMS_AND_CONDITIONS.SECTIONS.MODIFICATIONS.NOTIFICATION}</p>
      </div>
    </section>
  );

  const renderFooter = () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="acceptTerms"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
        />
        <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {TERMS_AND_CONDITIONS.ACTIONS.CHECKBOX_LABEL}
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
        >
          {TERMS_AND_CONDITIONS.ACTIONS.CANCEL}
        </Button>
        <Button
          variant="primary"
          onClick={handleAccept}
          disabled={!accepted}
        >
          {TERMS_AND_CONDITIONS.ACTIONS.ACCEPT}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      header={renderHeader()}
      footer={renderFooter()}
    >

      <div className="prose dark:prose-invert max-w-none space-y-6">
        {renderWelcomeSection()}
        {renderServicesSection()}
        {renderAppointmentsSection()}
        {renderPaymentsSection()}
        {renderPrivacySection()}
        {renderResponsibilitiesSection()}
        {renderLiabilitySection()}
        {renderModificationsSection()}
      </div>
    </Modal>
  );

export default TermsAndConditions;