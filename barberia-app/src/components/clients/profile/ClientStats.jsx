// ===================================================================
// 📊 ESTADÍSTICAS DEL CLIENTE - COMPONENTE
// ===================================================================
// Sección de estadísticas del cliente

import React from 'react';
import { CLIENT_PROFILE_LABELS } from '../../../constants';
import { Card } from '../../common';

const ClientStats = ({ client }) => {
  return (
    <Card>
      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
        {CLIENT_PROFILE_LABELS.SECTIONS.STATISTICS}
      </h4>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            {CLIENT_PROFILE_LABELS.STATS.TOTAL_VISITS}
          </span>
          <span className="font-semibold text-blue-600">{client.totalVisits}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            {CLIENT_PROFILE_LABELS.STATS.TOTAL_SPENT}
          </span>
          <span className="font-semibold text-green-600">
            S/{client.totalSpent?.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            {CLIENT_PROFILE_LABELS.STATS.AVAILABLE_POINTS}
          </span>
          <span className="font-semibold text-yellow-600">{client.loyaltyPoints}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            {CLIENT_PROFILE_LABELS.STATS.LAST_VISIT}
          </span>
          <span className="font-semibold">
            {client.lastVisit
              ? new Date(client.lastVisit).toLocaleDateString()
              : CLIENT_PROFILE_LABELS.STATS.NEVER
            }
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            {CLIENT_PROFILE_LABELS.STATS.CLIENT_SINCE}
          </span>
          <span className="font-semibold">
            {new Date(client.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ClientStats;