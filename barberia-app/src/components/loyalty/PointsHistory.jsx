import React, { useState, useEffect } from 'react';
import { FaCoins, FaArrowUp, FaArrowDown, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { useLoyaltyStore } from '../../stores';

const PointsHistory = ({ clientId }) => {
  const { getClientTransactions, getClientPoints } = useLoyaltyStore();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    const allTransactions = getClientTransactions(clientId);
    setTransactions(allTransactions);
    setCurrentPoints(getClientPoints(clientId));
    applyFilter(allTransactions, filter);
  }, [clientId]);

  useEffect(() => {
    applyFilter(transactions, filter);
  }, [filter, transactions]);

  const applyFilter = (transactions, filterType) => {
    let filtered = [...transactions];

    switch (filterType) {
      case 'earned':
        filtered = transactions.filter(t => t.type === 'earned');
        break;
      case 'redeemed':
        filtered = transactions.filter(t => t.type === 'redeemed');
        break;
      case 'recent':
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filtered = transactions.filter(t => new Date(t.date) >= oneMonthAgo);
        break;
      default:
        break;
    }

    setFilteredTransactions(filtered);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (transaction) => {
    if (transaction.type === 'earned') {
      return <FaArrowUp className="text-green-500" />;
    } else {
      return <FaArrowDown className="text-red-500" />;
    }
  };

  const getTransactionColor = (transaction) => {
    return transaction.type === 'earned' ? 'text-green-600' : 'text-red-600';
  };

  const filters = [
    { id: 'all', name: 'Todas', icon: FaFilter },
    { id: 'earned', name: 'Ganados', icon: FaArrowUp },
    { id: 'redeemed', name: 'Canjeados', icon: FaArrowDown },
    { id: 'recent', name: 'Último Mes', icon: FaCalendarAlt }
  ];

  const totalEarned = transactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);

  const totalRedeemed = transactions
    .filter(t => t.type === 'redeemed')
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  return (
    <div className="space-y-6">
      {/* Resumen de puntos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Puntos Actuales</p>
              <p className="text-3xl font-bold">{currentPoints}</p>
            </div>
            <FaCoins className="text-4xl text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Ganados</p>
              <p className="text-3xl font-bold">{totalEarned}</p>
            </div>
            <FaArrowUp className="text-4xl text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100">Total Canjeados</p>
              <p className="text-3xl font-bold">{totalRedeemed}</p>
            </div>
            <FaArrowDown className="text-4xl text-red-200" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filterOption) => {
          const IconComponent = filterOption.icon;
          return (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                filter === filterOption.id
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <IconComponent className="text-sm" />
              <span>{filterOption.name}</span>
            </button>
          );
        })}
      </div>

      {/* Lista de transacciones */}
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Historial de Puntos</h3>
          <p className="text-gray-600 text-sm">
            {filteredTransactions.length} transacciones
          </p>
        </div>

        <div className="divide-y">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTransactionIcon(transaction)}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </p>
                    {transaction.reference && (
                      <p className="text-xs text-gray-400">
                        Ref: {transaction.reference}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <p className={`font-bold text-lg ${getTransactionColor(transaction)}`}>
                    {transaction.points > 0 ? '+' : ''}{transaction.points}
                  </p>
                  <p className="text-sm text-gray-500">puntos</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="px-6 py-12 text-center">
            <FaCoins className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay transacciones
            </h3>
            <p className="text-gray-500">
              {filter === 'all'
                ? 'Aún no tienes historial de puntos'
                : 'No hay transacciones que coincidan con el filtro seleccionado'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsHistory;