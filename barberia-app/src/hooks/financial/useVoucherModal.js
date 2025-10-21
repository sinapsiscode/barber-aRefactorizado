import { useState } from 'react';

/**
 * Hook para gestionar el modal de visualización de vouchers
 */
export const useVoucherModal = () => {
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const openVoucherModal = (url, transaction) => {
    setSelectedVoucher({ url, transaction });
    setShowVoucherModal(true);
  };

  const closeVoucherModal = () => {
    setShowVoucherModal(false);
    setSelectedVoucher(null);
  };

  return {
    showVoucherModal,
    selectedVoucher,
    openVoucherModal,
    closeVoucherModal
  };
};
