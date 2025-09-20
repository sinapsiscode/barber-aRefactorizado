import { useClients } from '../hooks/useClients';

import ClientsHeader from '../components/clients/ClientsHeader';
import ClientsTabs from '../components/clients/ClientsTabs';
import ClientsMetrics from '../components/clients/ClientsMetrics';
import ClientsOverview from '../components/clients/ClientsOverview';
import ClientsTable from '../components/clients/ClientsTable';
import ClientForm from '../components/clients/ClientForm';
import ClientProfile from '../components/clients/ClientProfile';

const Clients = () => {
  const {
    // Estado
    showForm,
    showProfile,
    selectedClient,
    searchTerm,
    selectedTab,
    clients,
    clientStats,
    vipClients,
    flaggedClients,
    user,
    selectedBranch,

    // Acciones
    setSearchTerm,
    setSelectedTab,
    handleClientClick,
    handleFormSuccess,
    handleFormClose,
    handleProfileClose,
    handleProfileEdit,
    openNewClientForm
  } = useClients();

  return (
    <div className="space-y-6">
      <ClientsHeader
        user={user}
        selectedBranch={selectedBranch}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClient={openNewClientForm}
      />

      <ClientsTabs
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        flaggedCount={flaggedClients.length}
        userRole={user?.role}
      />

      <ClientsMetrics
        clientStats={clientStats}
        vipClientsCount={vipClients.length}
      />

      <ClientsOverview
        vipClients={vipClients}
        clientStats={clientStats}
      />

      <ClientsTable
        clients={clients}
        onClientClick={handleClientClick}
      />

      {/* Modales */}
      {showForm && (
        <ClientForm
          client={selectedClient}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {showProfile && selectedClient && (
        <ClientProfile
          client={selectedClient}
          onClose={handleProfileClose}
          onEdit={handleProfileEdit}
        />
      )}
    </div>
  );
};

export default Clients;