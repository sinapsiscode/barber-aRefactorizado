/**
 * Página de Gestión de Clientes - REFACTORIZADA
 *
 * Responsabilidades:
 * - Orquestar componentes modulares
 * - Manejar estado de modales
 * - Coordinar stores y hooks
 *
 * Total: ~180 líneas (vs 750 líneas original)
 */

import { useState, useEffect } from 'react';
import { useClientStore, useAuthStore, useBranchStore } from '../stores';
import { useClientFilters } from '../hooks/clients/useClientFilters';
import { useClientSelection } from '../hooks/clients/useClientSelection';
import { useUnwelcomeActions } from '../hooks/clients/useUnwelcomeActions';

// Componentes modulares
import ClientFilters from '../components/clients/ClientFilters';
import ClientTabs from '../components/clients/ClientTabs';
import ClientMetrics from '../components/clients/ClientMetrics';
import ClientAnalytics from '../components/clients/ClientAnalytics';
import { UnwelcomeActions } from '../components/clients/UnwelcomeManagement';
import { DataTable } from '../components/common';
import ClientForm from '../components/clients/ClientForm';
import ClientProfile from '../components/clients/ClientProfile';

// Configuración
import { getClientColumns } from '../config/clients/clientTableColumns';
import { CLIENT_TABS } from '../constants/clients/clientStatus';

const Clients = () => {
  // ==================== STORES ====================
  const {
    clients,
    loadClients,
    getVIPClients,
    markAsUnwelcome,
    removeUnwelcomeStatus
  } = useClientStore();

  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();

  // ==================== ESTADO LOCAL ====================
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(CLIENT_TABS.ALL);

  // ==================== CUSTOM HOOKS ====================

  // Hook de filtrado
  const {
    filteredClients,
    flaggedClients,
    unwelcomeClients,
    flaggedCount,
    unwelcomeCount
  } = useClientFilters(clients, {
    user,
    selectedBranch,
    selectedTab,
    searchTerm
  });

  // Hook de selección
  const {
    selectedClients,
    handleSelectClient,
    handleSelectAll: selectAllToggle,
    clearSelection,
    isAllSelected,
    getSelectedIds
  } = useClientSelection(selectedTab);

  // Hook de acciones "No Gratos"
  const {
    handleMarkAsUnwelcome,
    handleRemoveUnwelcome,
    handleRehabilitateAll,
    handleRehabilitateSelected,
    handleExportList
  } = useUnwelcomeActions(
    { markAsUnwelcome, removeUnwelcomeStatus },
    unwelcomeClients
  );

  // Datos adicionales
  const vipClients = getVIPClients();

  // ==================== EFECTOS ====================

  // Cargar clientes al montar
  useEffect(() => {
    if (clients.length === 0) {
      loadClients();
    }
  }, [clients.length, loadClients]);

  // ==================== HANDLERS ====================

  // Abrir perfil de cliente
  const handleClientClick = (client) => {
    setSelectedClient(client);
    setShowProfile(true);
  };

  // Nuevo cliente
  const handleNewClient = () => {
    setSelectedClient(null);
    setShowForm(true);
  };

  // Cerrar form
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedClient(null);
  };

  // Cerrar perfil
  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedClient(null);
  };

  // Editar desde perfil
  const handleEditFromProfile = () => {
    setShowProfile(false);
    setShowForm(true);
  };

  // Seleccionar todos (wrapper para pasar parámetro)
  const handleSelectAll = () => {
    selectAllToggle(unwelcomeClients);
  };

  // Rehabilitar seleccionados (wrapper)
  const handleRehabilitateSelectedWrapper = async () => {
    const success = await handleRehabilitateSelected(getSelectedIds());
    if (success) {
      clearSelection();
    }
  };

  // ==================== CONFIGURACIÓN DE TABLA ====================

  const columns = getClientColumns(selectedTab, {
    selectedClients,
    onSelectClient: handleSelectClient,
    onSelectAll: handleSelectAll,
    isAllSelected: isAllSelected(unwelcomeClients),
    onClientClick: handleClientClick,
    onMarkAsUnwelcome: handleMarkAsUnwelcome,
    onRemoveUnwelcome: handleRemoveUnwelcome
  });

  // ==================== RENDER ====================

  return (
    <div className="space-y-6">
      {/* Header y Búsqueda */}
      <ClientFilters
        user={user}
        selectedBranch={selectedBranch}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClient={handleNewClient}
      />

      {/* Sistema de Tabs */}
      <ClientTabs
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        flaggedCount={flaggedCount}
        unwelcomeCount={unwelcomeCount}
        user={user}
      />

      {/* Métricas Principales */}
      <ClientMetrics
        user={user}
        vipClients={vipClients}
        unwelcomeClients={unwelcomeClients}
      />

      {/* Cards de Análisis */}
      <ClientAnalytics vipClients={vipClients} />

      {/* Banner de Acciones Masivas (solo en tab unwelcome) */}
      {selectedTab === CLIENT_TABS.UNWELCOME && unwelcomeClients.length > 0 && (
        <UnwelcomeActions
          unwelcomeClients={unwelcomeClients}
          selectedClients={selectedClients}
          onSelectAll={handleSelectAll}
          onRehabilitateSelected={handleRehabilitateSelectedWrapper}
          onRehabilitateAll={handleRehabilitateAll}
          onExport={handleExportList}
        />
      )}

      {/* Tabla de Clientes */}
      <DataTable
        data={filteredClients}
        columns={columns}
        searchable={false}
        emptyMessage={
          selectedTab === CLIENT_TABS.UNWELCOME
            ? "No hay clientes marcados como no gratos"
            : "No se encontraron clientes"
        }
      />

      {/* Modal: Formulario de Cliente */}
      {showForm && (
        <ClientForm
          client={selectedClient}
          onClose={handleCloseForm}
          onSuccess={handleCloseForm}
        />
      )}

      {/* Modal: Perfil de Cliente */}
      {showProfile && selectedClient && (
        <ClientProfile
          client={selectedClient}
          onClose={handleCloseProfile}
          onEdit={handleEditFromProfile}
        />
      )}
    </div>
  );
};

export default Clients;
