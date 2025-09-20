import { useState, useEffect, useCallback } from 'react';
import { useClientStore, useAuthStore, useBranchStore } from '../stores';
import { CLIENT_TABS } from '../constants/clients';
import {
  filterClientsByBranch,
  filterFlaggedClients,
  searchClients
} from '../utils/clientHelpers';

export const useClients = () => {
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(CLIENT_TABS.ALL);

  const {
    clients,
    loadMockClients,
    getClientStats,
    getVIPClients,
    getFlaggedClients
  } = useClientStore();

  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();

  useEffect(() => {
    if (clients.length === 0) {
      loadMockClients();
    }
  }, [clients.length, loadMockClients]);

  // Filtros aplicados secuencialmente
  const branchFilteredClients = filterClientsByBranch(clients, user, selectedBranch);

  const tabFilteredClients = selectedTab === CLIENT_TABS.FLAGGED
    ? filterFlaggedClients(branchFilteredClients)
    : branchFilteredClients;

  const filteredClients = searchClients(tabFilteredClients, searchTerm);

  // Datos computados
  const clientStats = getClientStats();
  const vipClients = getVIPClients();
  const flaggedClients = getFlaggedClients();

  const handleClientClick = useCallback((client) => {
    setSelectedClient(client);
    setShowProfile(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    setSelectedClient(null);
  }, []);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    setSelectedClient(null);
  }, []);

  const handleProfileClose = useCallback(() => {
    setShowProfile(false);
    setSelectedClient(null);
  }, []);

  const handleProfileEdit = useCallback(() => {
    setShowProfile(false);
    setShowForm(true);
  }, []);

  const openNewClientForm = useCallback(() => {
    setSelectedClient(null);
    setShowForm(true);
  }, []);

  return {
    // Estado
    showForm,
    showProfile,
    selectedClient,
    searchTerm,
    selectedTab,
    clients: filteredClients,
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
  };
};