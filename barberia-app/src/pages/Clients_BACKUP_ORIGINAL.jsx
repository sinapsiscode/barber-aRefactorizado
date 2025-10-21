import { useState, useEffect } from 'react';
import { FiUsers, FiStar, FiGift, FiTrendingUp, FiPlus, FiSearch, FiAlertTriangle, FiShield, FiUserX, FiMoreVertical } from 'react-icons/fi';
import { useClientStore, useAuthStore, useBranchStore } from '../stores';
import { DataTable, MetricCard } from '../components/common';
import ClientForm from '../components/clients/ClientForm';
import ClientProfile from '../components/clients/ClientProfile';
import Swal from 'sweetalert2';

const Clients = () => {
  const {
    clients,
    loadClients,
    getClientStats,
    getVIPClients,
    searchClients,
    getFlaggedClients,
    clearSecurityFlags,
    markAsUnwelcome,
    removeUnwelcomeStatus,
    getUnwelcomeClients
  } = useClientStore();
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all'); // all, flagged, unwelcome
  const [selectedClients, setSelectedClients] = useState(new Set());

  useEffect(() => {
    if (clients.length === 0) {
      loadClients();
    }
  }, []);

  // Limpiar selecciones cuando cambie de pestaña
  useEffect(() => {
    setSelectedClients(new Set());
  }, [selectedTab]);

  // Filtrar clientes según la sede seleccionada (solo para super admin)
  const branchFilteredClients = user?.role === 'super_admin' && selectedBranch 
    ? clients.filter(client => client.branchId === selectedBranch.id)
    : clients;

  const clientStats = getClientStats();
  const vipClients = getVIPClients();
  const flaggedClients = getFlaggedClients();
  const unwelcomeClients = getUnwelcomeClients();
  
  // FILTRADO POR TAB - Muestra solo clientes según la pestaña seleccionada
  let tabFilteredClients = branchFilteredClients;
  if (selectedTab === 'flagged') {
    // Clientes problemáticos (banderas de seguridad, bloqueados, vouchers falsos)
    tabFilteredClients = branchFilteredClients.filter(client =>
      client.securityFlags?.isFlagged ||
      client.securityFlags?.blacklisted ||
      (client.securityFlags?.falseVouchersCount || 0) > 0
    );
  } else if (selectedTab === 'unwelcome') {
    // Solo clientes marcados como "no gratos"
    tabFilteredClients = branchFilteredClients.filter(client => client.isUnwelcome);
  }
  
  const filteredClients = searchTerm 
    ? tabFilteredClients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      )
    : tabFilteredClients;

  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowProfile(true);
  };

  const columns = [
    ...(selectedTab === 'unwelcome' ? [{
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={selectedClients.size === unwelcomeClients.length && unwelcomeClients.length > 0}
          onChange={handleSelectAll}
          className="rounded border-gray-300"
        />
      ),
      render: (value, client) => (
        <input
          type="checkbox"
          checked={selectedClients.has(client.id)}
          onChange={() => handleSelectClient(client.id)}
          className="rounded border-gray-300"
        />
      ),
      width: '50px'
    }] : []),
    {
      key: 'name',
      label: 'Cliente',
      render: (value, client) => (
        <button
          onClick={() => handleClientClick(client)}
          className="flex items-center space-x-3 text-left hover:text-primary-600"
        >
          <div className="relative">
            <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {value?.charAt(0) || '?'}
              </span>
            </div>
            {(client.securityFlags?.isFlagged || client.securityFlags?.blacklisted) && (
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="h-2.5 w-2.5 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900 dark:text-white">{value}</span>
              {client.securityFlags?.blacklisted && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">BLOQUEADO</span>
              )}
            </div>
            <div className="text-sm text-gray-500">{client.email}</div>
          </div>
        </button>
      )
    },
    {
      key: 'phone',
      label: 'Teléfono'
    },
    {
      key: 'totalVisits',
      label: 'Visitas',
      render: (value) => (
        <div className="text-center">
          <div className="font-semibold">{value}</div>
          <div className="text-xs text-gray-500">veces</div>
        </div>
      )
    },
    {
      key: 'totalSpent',
      label: 'Total Gastado',
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
      label: 'Puntos',
      render: (value) => (
        <div className="flex items-center space-x-1">
          <FiGift className="h-4 w-4 text-yellow-500" />
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'lastVisit',
      label: 'Última Visita',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Nunca'
    },
    {
      key: 'tier',
      label: 'Categoría',
      render: (value, client) => {
        const tier = getTierInfo(client.totalSpent);
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${tier.color}`}>
            {tier.name}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value, client) => {
        if (client.isUnwelcome) {
          return (
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center space-x-1">
                <FiUserX className="h-3 w-3" />
                <span>No Grato</span>
              </span>
            </div>
          );
        }
        if (client.status === 'blacklisted') {
          return (
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
              Bloqueado
            </span>
          );
        }
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Activo
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value, client) => (
        <div className="flex items-center space-x-2">
          {client.isUnwelcome ? (
            <button
              onClick={() => handleRemoveUnwelcomeStatus(client.id, client.name)}
              className="text-green-600 hover:text-green-800 text-xs px-2 py-1 rounded bg-green-50 hover:bg-green-100"
              title="Remover estado 'No Grato'"
            >
              Rehabilitar
            </button>
          ) : (
            <button
              onClick={() => handleMarkAsUnwelcome(client.id, client.name)}
              className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100"
              title="Marcar como 'No Grato'"
            >
              Marcar No Grato
            </button>
          )}
          <button
            onClick={() => {
              setSelectedClient(client);
              setShowProfile(true);
            }}
            className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
          >
            Ver Perfil
          </button>
        </div>
      )
    }
  ];

  const getTierInfo = (totalSpent) => {
    if (totalSpent >= 1000000) {
      return { name: 'Platinum', color: 'bg-purple-100 text-purple-800' };
    } else if (totalSpent >= 500000) {
      return { name: 'Gold', color: 'bg-yellow-100 text-yellow-800' };
    } else if (totalSpent >= 200000) {
      return { name: 'Silver', color: 'bg-gray-100 text-gray-800' };
    }
    return { name: 'Bronze', color: 'bg-orange-100 text-orange-800' };
  };

  const handleMarkAsUnwelcome = async (clientId, clientName) => {
    const { value: reason } = await Swal.fire({
      title: `¿Marcar como "No Grato"?`,
      text: `¿Estás seguro de que quieres marcar a ${clientName} como cliente no grato?`,
      input: 'textarea',
      inputLabel: 'Motivo (obligatorio)',
      inputPlaceholder: 'Describe el motivo por el cual este cliente es considerado no grato...',
      inputValidator: (value) => {
        if (!value || value.trim().length < 10) {
          return 'Debes proporcionar un motivo de al menos 10 caracteres'
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Marcar como No Grato',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      icon: 'warning'
    });

    if (reason) {
      markAsUnwelcome(clientId, reason.trim());
      Swal.fire({
        title: 'Cliente Marcado',
        text: `${clientName} ha sido marcado como cliente no grato`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleRemoveUnwelcomeStatus = async (clientId, clientName) => {
    const result = await Swal.fire({
      title: '¿Remover estado "No Grato"?',
      text: `¿Estás seguro de que quieres remover el estado de "No Grato" de ${clientName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#059669'
    });

    if (result.isConfirmed) {
      removeUnwelcomeStatus(clientId);
      Swal.fire({
        title: 'Estado Removido',
        text: `${clientName} ya no es considerado cliente no grato`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleRehabilitateAll = async () => {
    const result = await Swal.fire({
      title: '¿Rehabilitar todos los clientes?',
      text: `¿Estás seguro de que quieres remover el estado de "No Grato" de todos los ${unwelcomeClients.length} cliente${unwelcomeClients.length > 1 ? 's' : ''}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, rehabilitar ${unwelcomeClients.length > 1 ? 'todos' : ''}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#059669'
    });

    if (result.isConfirmed) {
      unwelcomeClients.forEach(client => {
        removeUnwelcomeStatus(client.id);
      });

      Swal.fire({
        title: 'Clientes Rehabilitados',
        text: `${unwelcomeClients.length} cliente${unwelcomeClients.length > 1 ? 's han' : ' ha'} sido rehabilitado${unwelcomeClients.length > 1 ? 's' : ''}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleExportUnwelcomeList = () => {
    const unwelcomeData = unwelcomeClients.map(client => ({
      nombre: client.name,
      email: client.email,
      telefono: client.phone,
      motivo: client.unwelcomeReason,
      fechaMarcado: new Date(client.unwelcomeDate).toLocaleDateString(),
      totalGastado: client.totalSpent,
      ultimaVisita: client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : 'Nunca'
    }));

    const dataStr = JSON.stringify(unwelcomeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `clientes_no_gratos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    Swal.fire({
      title: 'Lista Exportada',
      text: 'La lista de clientes no gratos ha sido descargada',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleSelectClient = (clientId) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId);
    } else {
      newSelected.add(clientId);
    }
    setSelectedClients(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTab === 'unwelcome') {
      if (selectedClients.size === unwelcomeClients.length) {
        setSelectedClients(new Set());
      } else {
        setSelectedClients(new Set(unwelcomeClients.map(c => c.id)));
      }
    }
  };

  const handleRehabilitateSelected = async () => {
    const selectedClientsList = Array.from(selectedClients);
    if (selectedClientsList.length === 0) return;

    const clientNames = selectedClientsList
      .map(id => unwelcomeClients.find(c => c.id === id)?.name)
      .filter(Boolean);

    const result = await Swal.fire({
      title: '¿Rehabilitar clientes seleccionados?',
      html: `¿Estás seguro de que quieres remover el estado de "No Grato" de los siguientes clientes?<br><br><strong>${clientNames.join(', ')}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Rehabilitar ${selectedClientsList.length} cliente${selectedClientsList.length > 1 ? 's' : ''}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#059669'
    });

    if (result.isConfirmed) {
      selectedClientsList.forEach(clientId => {
        removeUnwelcomeStatus(clientId);
      });

      setSelectedClients(new Set());

      Swal.fire({
        title: 'Clientes Rehabilitados',
        text: `${selectedClientsList.length} cliente${selectedClientsList.length > 1 ? 's han' : ' ha'} sido rehabilitado${selectedClientsList.length > 1 ? 's' : ''}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestión de Clientes
            {user?.role === 'super_admin' && selectedBranch && (
              <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                - {selectedBranch.name}
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user?.role === 'super_admin' && selectedBranch 
              ? `Administra clientes y programa de fidelización de ${selectedBranch.city}`
              : 'Administra clientes y programa de fidelización'
            }
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FiSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 input-field"
            />
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* SISTEMA DE TABS - Muestra pestañas de clientes especiales
          Solo aparece cuando:
          - El usuario es admin o superadmin
          - Hay al menos un cliente con problemas de seguridad o marcado como no grato */}
      {(user?.role === 'super_admin' || user?.role === 'branch_admin') && (flaggedClients.length > 0 || unwelcomeClients.length > 0) && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('all')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'all'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Todos los clientes
            </button>
            {flaggedClients.length > 0 && (
              <button
                onClick={() => setSelectedTab('flagged')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === 'flagged'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FiAlertTriangle className="h-4 w-4" />
                <span>Clientes sospechosos</span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {flaggedClients.length}
                </span>
              </button>
            )}
            {unwelcomeClients.length > 0 && (
              <button
                onClick={() => setSelectedTab('unwelcome')}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === 'unwelcome'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <FiUserX className="h-4 w-4" />
                <span>Clientes No Gratos</span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {unwelcomeClients.length}
                </span>
              </button>
            )}
          </nav>
        </div>
      )}

      {/* Client Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Clientes Totales"
          value={clientStats.totalClients?.toLocaleString() || '0'}
          icon={FiUsers}
          color="bg-blue-500"
        />
        <MetricCard
          title="Nuevos Este Mes"
          value={clientStats.newClientsThisMonth || 0}
          icon={FiTrendingUp}
          color="bg-green-500"
        />
        <MetricCard
          title="Clientes VIP"
          value={vipClients.length || 0}
          icon={FiStar}
          color="bg-purple-500"
        />
        {(user?.role === 'super_admin' || user?.role === 'branch_admin') && (
          <MetricCard
            title="Clientes No Gratos"
            value={unwelcomeClients.length || 0}
            icon={FiUserX}
            color="bg-red-500"
            description="Marcados como problemáticos"
          />
        )}
        <MetricCard
          title="Gasto Promedio"
          value={`S/${(clientStats.avgSpendingPerClient || 0).toFixed(0)}`}
          icon={FiGift}
          color="bg-yellow-500"
          description="Por cliente"
        />
      </div>

      {/* Client Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Clientes VIP
          </h3>
          <div className="space-y-3">
            {vipClients.slice(0, 5).map((client, index) => (
              <div key={client.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {client.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {client.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.totalVisits} visitas
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">
                    S/{(client.totalSpent / 1000).toFixed(1)}K
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiGift className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm text-gray-500">{client.loyaltyPoints}pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribución por Categoría
          </h3>
          <div className="space-y-3">
            {Object.entries(clientStats.loyaltyTiers).map(([tier, count]) => {
              const tierInfo = {
                Platinum: { color: 'bg-purple-500', percentage: (count / clientStats.total * 100).toFixed(1) },
                Gold: { color: 'bg-yellow-500', percentage: (count / clientStats.total * 100).toFixed(1) },
                Silver: { color: 'bg-gray-400', percentage: (count / clientStats.total * 100).toFixed(1) },
                Bronze: { color: 'bg-orange-500', percentage: (count / clientStats.total * 100).toFixed(1) }
              };
              
              return (
                <div key={tier} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${tierInfo[tier].color}`}></div>
                    <span className="font-medium text-gray-900 dark:text-white">{tier}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{count}</span>
                    <div className="text-xs text-gray-500">{tierInfo[tier].percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Estadísticas Generales
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Gasto Promedio</span>
              <span className="font-semibold text-green-600">
                S/{clientStats.avgSpendingPerClient?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Puntos de Lealtad</span>
              <span className="font-semibold">
                {clientStats.totalLoyaltyPoints?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Ingresos Totales</span>
              <span className="font-semibold text-blue-600">
                S/{((clientStats.totalSpending || 0) / 1000).toFixed(1)}K
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Promedio por Cliente</span>
              <span className={`font-semibold ${
                (clientStats.avgSpendingPerClient || 0) >= 100 ? 'text-green-600' : 
                (clientStats.avgSpendingPerClient || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                S/{(clientStats.avgSpendingPerClient || 0).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Special Actions for Unwelcome Clients */}
      {selectedTab === 'unwelcome' && unwelcomeClients.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FiUserX className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="text-sm font-medium text-red-900 dark:text-red-100">
                  Gestión de Clientes No Gratos
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {unwelcomeClients.length} cliente{unwelcomeClients.length > 1 ? 's' : ''} marcado{unwelcomeClients.length > 1 ? 's' : ''} como no grato{unwelcomeClients.length > 1 ? 's' : ''}
                  {selectedClients.size > 0 && (
                    <span className="ml-2 font-medium">
                      • {selectedClients.size} seleccionado{selectedClients.size > 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                {selectedClients.size === unwelcomeClients.length ? 'Deseleccionar Todos' : 'Seleccionar Todos'}
              </button>
              {selectedClients.size > 0 && (
                <button
                  onClick={handleRehabilitateSelected}
                  className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  Rehabilitar Seleccionados ({selectedClients.size})
                </button>
              )}
              <button
                onClick={handleRehabilitateAll}
                className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
              >
                Rehabilitar Todos
              </button>
              <button
                onClick={handleExportUnwelcomeList}
                className="px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors"
              >
                Exportar Lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <DataTable
        data={filteredClients}
        columns={columns}
        searchable={false}
        emptyMessage={selectedTab === 'unwelcome' ? "No hay clientes marcados como no gratos" : "No se encontraron clientes"}
      />

      {/* Client Form Modal */}
      {showForm && (
        <ClientForm
          client={selectedClient}
          onClose={() => {
            setShowForm(false);
            setSelectedClient(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setSelectedClient(null);
          }}
        />
      )}

      {/* Client Profile Modal */}
      {showProfile && selectedClient && (
        <ClientProfile
          client={selectedClient}
          onClose={() => {
            setShowProfile(false);
            setSelectedClient(null);
          }}
          onEdit={() => {
            setShowProfile(false);
            setShowForm(true);
          }}
        />
      )}
    </div>
  );
};

export default Clients;