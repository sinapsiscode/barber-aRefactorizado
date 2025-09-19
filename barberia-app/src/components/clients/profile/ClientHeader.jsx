// ===================================================================
// 👤 HEADER DEL PERFIL DE CLIENTE - COMPONENTE
// ===================================================================
// Header con información básica del cliente

import React from 'react';
import { FiEdit, FiGift, FiAlertTriangle, FiCalendar } from 'react-icons/fi';
import { CLIENT_PROFILE_LABELS } from '../../../constants';
import { Button, Avatar, Badge } from '../../common';

const ClientHeader = ({
  client,
  tier,
  getTierColor,
  onEdit,
  onNewAppointment,
  onRedeemPoints
}) => {
  return (
    <div className="bg-white dark:bg-dark-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar
            name={client.name}
            size="lg"
            className="w-16 h-16"
          />

          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {client.name}
              </h2>

              <Badge
                variant="outline"
                className={getTierColor(tier.name)}
              >
                {tier.name}
              </Badge>

              {client.securityFlags?.blacklisted && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <FiAlertTriangle className="w-3 h-3" />
                  <span>{CLIENT_PROFILE_LABELS.SECURITY.BLOCKED}</span>
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <FiGift className="w-4 h-4 text-yellow-500" />
                <span>{client.loyaltyPoints} puntos</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiCalendar className="w-4 h-4" />
                <span>{CLIENT_PROFILE_LABELS.STATS.CLIENT_SINCE}: {new Date(client.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex items-center space-x-2"
          >
            <FiEdit className="w-4 h-4" />
            <span>{CLIENT_PROFILE_LABELS.ACTIONS.EDIT}</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onNewAppointment}
          >
            {CLIENT_PROFILE_LABELS.ACTIONS.NEW_APPOINTMENT}
          </Button>

          {client.loyaltyPoints > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRedeemPoints}
              className="flex items-center space-x-2 text-yellow-600 border-yellow-300 hover:bg-yellow-50"
            >
              <FiGift className="w-4 h-4" />
              <span>{CLIENT_PROFILE_LABELS.ACTIONS.REDEEM_POINTS}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;