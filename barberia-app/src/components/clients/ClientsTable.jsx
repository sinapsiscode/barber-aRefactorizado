import { FiAlertTriangle, FiGift } from 'react-icons/fi';
import { DataTable } from '../common';
import {
  CLIENT_TABLE_LABELS,
  CLIENT_MANAGEMENT_TEXTS,
  CLIENT_STATUS_TEXTS,
  CLIENT_STATUS_COLORS
} from '../../constants/clients';
import {
  getTierInfo,
  isClientFlagged,
  isClientBlocked,
  formatLastVisit,
  formatClientName
} from '../../utils/clientHelpers';

const ClientsTable = ({ clients, onClientClick }) => {
  const columns = [
    {
      key: 'name',
      label: CLIENT_TABLE_LABELS.CLIENT,
      render: (value, client) => (
        <ClientNameCell
          client={client}
          onClientClick={onClientClick}
        />
      )
    },
    {
      key: 'phone',
      label: CLIENT_TABLE_LABELS.PHONE
    },
    {
      key: 'totalVisits',
      label: CLIENT_TABLE_LABELS.VISITS,
      render: (value) => (
        <div className="text-center">
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-gray-500">{CLIENT_TABLE_LABELS.TIMES}</div>
        </div>
      )
    },
    {
      key: 'totalSpent',
      label: CLIENT_TABLE_LABELS.TOTAL_SPENT,
      render: (value) => (
        <div className="text-right">
          <div className="font-semibold text-green-600">
            S/{value?.toLocaleString() || '0'}
          </div>
        </div>
      )
    },
    {
      key: 'loyaltyPoints',
      label: CLIENT_TABLE_LABELS.POINTS,
      render: (value) => (
        <div className="flex items-center space-x-1">
          <FiGift className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'lastVisit',
      label: CLIENT_TABLE_LABELS.LAST_VISIT,
      render: (value) => formatLastVisit(value)
    },
    {
      key: 'tier',
      label: CLIENT_TABLE_LABELS.CATEGORY,
      render: (value, client) => {
        const tier = getTierInfo(client.totalSpent);
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${tier.color}`}>
            {tier.name}
          </span>
        );
      }
    }
  ];

  return (
    <DataTable
      data={clients}
      columns={columns}
      searchable={false}
      emptyMessage={CLIENT_MANAGEMENT_TEXTS.EMPTY_MESSAGE}
    />
  );
};

const ClientNameCell = ({ client, onClientClick }) => {
  const isFlagged = isClientFlagged(client);
  const isBlocked = isClientBlocked(client);

  return (
    <button
      onClick={() => onClientClick(client)}
      className="flex items-center space-x-3 text-left hover:text-primary-600"
    >
      <div className="relative">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
          isFlagged ? CLIENT_STATUS_COLORS.FLAGGED : CLIENT_STATUS_COLORS.NORMAL
        }`}>
          <span className="text-white font-medium">
            {formatClientName(client.name)}
          </span>
        </div>
        {isFlagged && (
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
            <FiAlertTriangle className="h-2.5 w-2.5 text-white" />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900 dark:text-white">
            {client.name}
          </span>
          {isBlocked && (
            <span className={`px-1.5 py-0.5 text-xs font-medium rounded ${CLIENT_STATUS_COLORS.BLOCKED}`}>
              {CLIENT_STATUS_TEXTS.BLOCKED}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">{client.email}</div>
      </div>
    </button>
  );
};

export default ClientsTable;