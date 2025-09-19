import React from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useBranchStore } from '../../stores';
import { useClientForm } from '../../hooks';
import {
  CLIENT_LABELS,
  CLIENT_PLACEHOLDERS,
  CLIENT_BENEFITS_LIST
} from '../../constants';
import { Modal, FormInput, Button, Select } from '../common';

const ClientForm = ({ client = null, onClose, onSuccess }) => {
  const { branches } = useBranchStore();

  const {
    formData,
    loading,
    errors,
    handleChange,
    handleSubmit,
    clearFieldError
  } = useClientForm(client, onSuccess);

  const title = client ? CLIENT_LABELS.FORM.EDIT_TITLE : CLIENT_LABELS.FORM.NEW_TITLE;

  const branchOptions = branches.map(branch => ({
    value: branch.id,
    label: `${branch.name} - ${branch.city}`
  }));

  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label={CLIENT_LABELS.FORM.NAME}
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        onFocus={() => clearFieldError('name')}
        error={errors.name}
        icon={FiUser}
        required
        placeholder={CLIENT_PLACEHOLDERS.NAME}
      />

      <FormInput
        label={CLIENT_LABELS.FORM.EMAIL}
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        onFocus={() => clearFieldError('email')}
        error={errors.email}
        icon={FiMail}
        required
        placeholder={CLIENT_PLACEHOLDERS.EMAIL}
      />
    </div>
  );

  const renderContactInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormInput
        label={CLIENT_LABELS.FORM.PHONE}
        type="tel"
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        onFocus={() => clearFieldError('phone')}
        error={errors.phone}
        icon={FiPhone}
        required
        placeholder={CLIENT_PLACEHOLDERS.PHONE}
      />

      <FormInput
        label={CLIENT_LABELS.FORM.BIRTH_DATE}
        type="date"
        value={formData.birthDate}
        onChange={(e) => handleChange('birthDate', e.target.value)}
        icon={FiCalendar}
      />
    </div>
  );

  const renderAddressAndBranch = () => (
    <>
      <FormInput
        label={CLIENT_LABELS.FORM.ADDRESS}
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        onFocus={() => clearFieldError('address')}
        error={errors.address}
        icon={FiMapPin}
        placeholder={CLIENT_PLACEHOLDERS.ADDRESS}
      />

      <Select
        label={CLIENT_LABELS.FORM.PREFERRED_BRANCH}
        value={formData.preferredBranch}
        onChange={(value) => handleChange('preferredBranch', parseInt(value))}
        options={branchOptions}
      />
    </>
  );

  const renderNotes = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {CLIENT_LABELS.FORM.ADDITIONAL_NOTES}
      </label>
      <textarea
        value={formData.notes}
        onChange={(e) => handleChange('notes', e.target.value)}
        onFocus={() => clearFieldError('notes')}
        rows={3}
        className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 ${
          errors.notes ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
        }`}
        placeholder={CLIENT_PLACEHOLDERS.NOTES}
      />
      {errors.notes && (
        <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
      )}
    </div>
  );

  const renderNewClientBenefits = () => (
    !client && (
      <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          {CLIENT_LABELS.BENEFITS.TITLE}
        </h4>
        <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          {CLIENT_BENEFITS_LIST.map((benefit, index) => (
            <div key={index}>• {benefit}</div>
          ))}
        </div>
      </div>
    )
  );

  const renderClientStats = () => (
    client && (
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">
            {client.totalVisits}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {CLIENT_LABELS.STATS.VISITS}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-green-600">
            S/{client.totalSpent?.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {CLIENT_LABELS.STATS.SPENT}
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg text-center">
          <div className="text-lg font-semibold text-yellow-600">
            {client.loyaltyPoints}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {CLIENT_LABELS.STATS.POINTS}
          </div>
        </div>
      </div>
    )
  );

  const renderFooter = () => (
    <div className="flex justify-end space-x-3 pt-4">
      <Button
        variant="outline"
        onClick={onClose}
      >
        {CLIENT_LABELS.FORM.CANCEL}
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        loading={loading}
        loadingText={CLIENT_LABELS.FORM.SAVING}
      >
        {client ? CLIENT_LABELS.FORM.UPDATE : CLIENT_LABELS.FORM.CREATE}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      size="lg"
      footer={renderFooter()}
    >

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderBasicInfo()}
        {renderContactInfo()}
        {renderAddressAndBranch()}
        {renderNotes()}
        {renderNewClientBenefits()}
        {renderClientStats()}
      </form>
    </Modal>
  );

export default ClientForm;