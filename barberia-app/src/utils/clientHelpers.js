import {
  CLIENT_TIERS,
  CLIENT_SECURITY_CONFIG,
  CLIENT_STATS_THRESHOLDS
} from '../constants/clients';

export const getTierInfo = (totalSpent) => {
  const tierEntries = Object.entries(CLIENT_TIERS);

  for (const [key, tier] of tierEntries) {
    if (totalSpent >= tier.threshold) {
      return tier;
    }
  }

  return CLIENT_TIERS.BRONZE;
};

export const filterClientsByBranch = (clients, user, selectedBranch) => {
  return user?.role === 'super_admin' && selectedBranch
    ? clients.filter(client => client.branchId === selectedBranch.id)
    : clients;
};

export const filterFlaggedClients = (clients) => {
  return clients.filter(client =>
    client.securityFlags?.isFlagged ||
    client.securityFlags?.blacklisted ||
    (client.securityFlags?.falseVouchersCount || 0) > 0
  );
};

export const searchClients = (clients, searchTerm) => {
  if (!searchTerm) return clients;

  const term = searchTerm.toLowerCase();
  return clients.filter(client =>
    client.name.toLowerCase().includes(term) ||
    client.email.toLowerCase().includes(term) ||
    client.phone.includes(searchTerm)
  );
};

export const isClientFlagged = (client) => {
  return client.securityFlags?.isFlagged || client.securityFlags?.blacklisted;
};

export const isClientBlocked = (client) => {
  return client.securityFlags?.blacklisted;
};

export const hasSecurityAccess = (userRole) => {
  return userRole === 'super_admin' || userRole === 'branch_admin';
};

export const getSpendingColorClass = (avgSpending) => {
  if (avgSpending >= CLIENT_STATS_THRESHOLDS.HIGH_SPENDING) {
    return CLIENT_STATS_THRESHOLDS.COLORS.HIGH;
  } else if (avgSpending >= CLIENT_STATS_THRESHOLDS.MEDIUM_SPENDING) {
    return CLIENT_STATS_THRESHOLDS.COLORS.MEDIUM;
  }
  return CLIENT_STATS_THRESHOLDS.COLORS.LOW;
};

export const formatClientName = (name) => {
  return name.charAt(0).toUpperCase();
};

export const formatClientSpending = (totalSpent) => {
  if (totalSpent >= 1000) {
    return `S/${(totalSpent / 1000).toFixed(1)}K`;
  }
  return `S/${totalSpent?.toLocaleString() || '0'}`;
};

export const formatLastVisit = (lastVisit) => {
  return lastVisit ? new Date(lastVisit).toLocaleDateString() : 'Nunca';
};

export const calculateTierPercentage = (count, total) => {
  return total > 0 ? (count / total * 100).toFixed(1) : '0.0';
};

export const getClientInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};