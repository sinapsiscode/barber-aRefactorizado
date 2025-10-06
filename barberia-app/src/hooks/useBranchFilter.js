import { useAuthStore, useBranchStore } from '../stores';

/**
 * Hook para filtrar datos según el rol del usuario
 * - Super Admin: Ve todos los datos
 * - Branch Admin: Solo ve datos de su sede
 * - Otros roles: Ve datos según sus permisos específicos
 */
const useBranchFilter = () => {
  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();

  // Determinar qué sede debe ver el usuario
  const getUserBranchId = () => {
    if (user?.role === 'super_admin') {
      // Super admin puede ver cualquier sede (la seleccionada o todas)
      return selectedBranch?.id || null;
    }

    if (user?.role === 'branch_admin') {
      // Branch admin solo puede ver su propia sede
      return user.branchId;
    }

    // Otros roles usan su branchId asignado
    return user?.branchId || null;
  };

  // Verificar si el usuario puede ver datos de una sede específica
  const canViewBranch = (branchId) => {
    if (user?.role === 'super_admin') {
      return true; // Super admin puede ver todas las sedes
    }

    if (user?.role === 'branch_admin') {
      return branchId === user.branchId; // Solo su propia sede
    }

    // Otros roles solo su sede asignada
    return branchId === user?.branchId;
  };

  // Filtrar array de datos por sede
  const filterByBranch = (data, branchKey = 'branchId') => {
    if (!data || !Array.isArray(data)) return [];

    const userBranchId = getUserBranchId();

    // Si es super admin y no hay sede seleccionada, mostrar todos
    if (user?.role === 'super_admin' && !userBranchId) {
      return data;
    }

    // Filtrar por la sede apropiada
    if (userBranchId) {
      return data.filter(item => item[branchKey] === userBranchId);
    }

    return data;
  };

  // Filtrar datos financieros
  const filterFinancialData = (transactions) => {
    return filterByBranch(transactions, 'branchId');
  };

  // Filtrar datos de personal
  const filterStaffData = (staff) => {
    return filterByBranch(staff, 'branchId');
  };

  // Filtrar datos de clientes
  const filterClientData = (clients) => {
    // Los clientes pueden no tener branchId directo, usar el de sus citas
    return filterByBranch(clients, 'branchId');
  };

  // Filtrar citas
  const filterAppointmentData = (appointments) => {
    return filterByBranch(appointments, 'branchId');
  };

  // Verificar si debe mostrar selector de sede
  const shouldShowBranchSelector = () => {
    return user?.role === 'super_admin';
  };

  // Obtener título de la página con información de sede
  const getBranchTitle = (baseTitle) => {
    if (user?.role === 'branch_admin' && user.branchId) {
      // Buscar el nombre de la sede del branch admin
      const { branches } = useBranchStore.getState();
      const userBranch = branches.find(b => b.id === user.branchId);

      if (userBranch) {
        return `${baseTitle} - ${userBranch.name}`;
      }
    }

    if (user?.role === 'super_admin' && selectedBranch) {
      return `${baseTitle} - ${selectedBranch.name}`;
    }

    return baseTitle;
  };

  // Obtener descripción con restricción de sede
  const getBranchDescription = (baseDescription) => {
    if (user?.role === 'branch_admin') {
      const { branches } = useBranchStore.getState();
      const userBranch = branches.find(b => b.id === user.branchId);

      if (userBranch) {
        return `${baseDescription} de ${userBranch.name}`;
      }
    }

    if (user?.role === 'super_admin' && selectedBranch) {
      return `${baseDescription} de ${selectedBranch.name}`;
    }

    return baseDescription;
  };

  return {
    // Datos de usuario
    userBranchId: getUserBranchId(),
    canViewBranch,
    shouldShowBranchSelector: shouldShowBranchSelector(),

    // Funciones de filtrado
    filterByBranch,
    filterFinancialData,
    filterStaffData,
    filterClientData,
    filterAppointmentData,

    // Helpers para UI
    getBranchTitle,
    getBranchDescription,

    // Info del usuario
    userRole: user?.role,
    isAdmin: user?.role === 'super_admin',
    isBranchAdmin: user?.role === 'branch_admin'
  };
};

export default useBranchFilter;