// ===================================================================
// 🔒 SECCIÓN DE SEGURIDAD - COMPONENTE
// ===================================================================
// Sección de alertas y configuración de seguridad del cliente
import React from 'react';
import { FiShield, FiAlertTriangle } from 'react-icons/fi';
import { CLIENT_PROFILE_LABELS } from '../../../constants';
import { Card, Button } from '../../common';

const SecuritySection = ({ client, onClearSecurityFlags, user }) => {
  const hasSecurityIssues = client.securityFlags?.falseVouchers > 0 ||
                            client.securityFlags?.rejectedPayments > 0 ||
                            client.securityFlags?.blacklisted;

  if (!hasSecurityIssues && user?.role !== 'admin') {
    return null;
  }

  return (
    <Card>
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
        <FiShield className="h-4 w-4" />
        <span>{CLIENT_PROFILE_LABELS.SECTIONS.SECURITY_ALERTS}</span>
      </h4>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            {CLIENT_PROFILE_LABELS.SECURITY.SECURITY_STATUS}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            client.securityFlags?.blacklisted
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}>
            {client.securityFlags?.blacklisted
              ? CLIENT_PROFILE_LABELS.SECURITY.BLOCKED
              : 'ACTIVO'
            }
          </span>
        </div>

        {(client.securityFlags?.falseVouchers > 0 || client.securityFlags?.rejectedPayments > 0) && (
          <div className="bg-red-50 dark:bg-red-900 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiAlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800 dark:text-red-100">
                {CLIENT_PROFILE_LABELS.SECURITY.REJECTION_HISTORY}
              </span>
            </div>
            <div className="text-xs text-red-700 dark:text-red-200 space-y-1">
              {client.securityFlags?.falseVouchers > 0 && (
                <div>
                  {CLIENT_PROFILE_LABELS.SECURITY.FALSE_VOUCHERS} {client.securityFlags.falseVouchers}
                </div>
              )}
              {client.securityFlags?.rejectedPayments > 0 && (
                <div>
                  {CLIENT_PROFILE_LABELS.SECURITY.REJECTED_PAYMENTS} {client.securityFlags.rejectedPayments}
                </div>
              )}
            </div>
          </div>
        )}

        {user?.role === 'admin' && hasSecurityIssues && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSecurityFlags}
            className="w-full text-red-600 border-red-300 hover:bg-red-50"
          >
            {CLIENT_PROFILE_LABELS.ACTIONS.CLEAR_FLAGS}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SecuritySection;