import React from 'react';
import ReactFlagsSelect from 'react-flags-select';
import { useBranchForm } from '../../hooks';
import {
  BRANCH_LABELS,
  BRANCH_PLACEHOLDERS,
  AVAILABLE_COUNTRIES
} from '../../constants';
import { Modal, FormInput, Button } from '../common';

const BranchForm = ({ branch = null, onClose }) => {
  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    clearFieldError
  } = useBranchForm(branch, onClose);

  const title = branch ? BRANCH_LABELS.FORM.EDIT_TITLE : BRANCH_LABELS.FORM.NEW_TITLE;

  const renderBasicInfo = () => (
    <div>
      <h3 className="text-lg font-normal text-gray-700 dark:text-gray-300 mb-6">
        {BRANCH_LABELS.FORM.BASIC_INFO}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label={BRANCH_LABELS.FORM.NAME}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onFocus={() => clearFieldError('name')}
          error={errors.name}
          required
          placeholder={BRANCH_PLACEHOLDERS.NAME}
        />

        <FormInput
          label={BRANCH_LABELS.FORM.CITY}
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          onFocus={() => clearFieldError('city')}
          error={errors.city}
          required
          placeholder={BRANCH_PLACEHOLDERS.CITY}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {BRANCH_LABELS.FORM.COUNTRY}
          </label>
          <div className="react-flags-select-wrapper">
            <ReactFlagsSelect
              selected={formData.country}
              onSelect={(countryCode) => handleChange('country', countryCode)}
              countries={AVAILABLE_COUNTRIES.CODES}
              customLabels={AVAILABLE_COUNTRIES.LABELS}
              placeholder={BRANCH_PLACEHOLDERS.COUNTRY_SELECT}
              searchable={false}
              className="w-full"
            />
          </div>
        </div>

        <FormInput
          label={BRANCH_LABELS.FORM.ADDRESS}
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          onFocus={() => clearFieldError('address')}
          error={errors.address}
          required
          placeholder={BRANCH_PLACEHOLDERS.ADDRESS}
        />
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div>
      <h3 className="text-lg font-normal text-gray-700 dark:text-gray-300 mb-6">
        {BRANCH_LABELS.FORM.CONTACT_INFO}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label={BRANCH_LABELS.FORM.PHONE}
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onFocus={() => clearFieldError('phone')}
          error={errors.phone}
          required
          placeholder={BRANCH_PLACEHOLDERS.PHONE}
        />

        <FormInput
          label={BRANCH_LABELS.FORM.EMAIL}
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onFocus={() => clearFieldError('email')}
          error={errors.email}
          required
          placeholder={BRANCH_PLACEHOLDERS.EMAIL}
        />

        <FormInput
          label={BRANCH_LABELS.FORM.MANAGER}
          value={formData.manager}
          onChange={(e) => handleChange('manager', e.target.value)}
          onFocus={() => clearFieldError('manager')}
          error={errors.manager}
          required
          placeholder={BRANCH_PLACEHOLDERS.MANAGER}
        />

        <FormInput
          label={BRANCH_LABELS.FORM.MANAGER_PHONE}
          value={formData.managerPhone}
          onChange={(e) => handleChange('managerPhone', e.target.value)}
          onFocus={() => clearFieldError('managerPhone')}
          error={errors.managerPhone}
          required
          placeholder={BRANCH_PLACEHOLDERS.MANAGER_PHONE}
        />
      </div>
    </div>
  );

  const renderServicesAmenities = () => (
    <div>
      <h3 className="text-lg font-normal text-gray-700 dark:text-gray-300 mb-6">
        {BRANCH_LABELS.FORM.SERVICES_AMENITIES}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {BRANCH_LABELS.FORM.SERVICES}
          </label>
          <textarea
            value={formData.services}
            onChange={(e) => handleChange('services', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
            rows="3"
            placeholder={BRANCH_PLACEHOLDERS.SERVICES}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {BRANCH_LABELS.FORM.AMENITIES}
          </label>
          <textarea
            value={formData.amenities}
            onChange={(e) => handleChange('amenities', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
            rows="3"
            placeholder={BRANCH_PLACEHOLDERS.AMENITIES}
          />
        </div>
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-[#D4AF37]/20">
      <Button
        variant="outline"
        onClick={onClose}
      >
        {BRANCH_LABELS.FORM.CANCEL}
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        loading={isLoading}
        loadingText={BRANCH_LABELS.FORM.PROCESSING}
      >
        {branch ? BRANCH_LABELS.FORM.UPDATE : BRANCH_LABELS.FORM.CREATE}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      size="xl"
      footer={renderFooter()}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {renderBasicInfo()}
        {renderContactInfo()}
        {renderServicesAmenities()}
      </form>
    </Modal>
  );
};

export default BranchForm;