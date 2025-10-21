import Swal from 'sweetalert2';
import { useClientStore } from '../../stores';
import { CLIENT_PROFILE_TEXTS } from '../../constants/clientProfile';

/**
 * Hook para acciones de seguridad del cliente
 */
export const useSecurityActions = (client, onClose) => {
  const { clearSecurityFlags } = useClientStore();

  const handleClearSecurityFlags = async () => {
    const result = await Swal.fire({
      title: CLIENT_PROFILE_TEXTS.clearFlagsConfirmTitle,
      text: CLIENT_PROFILE_TEXTS.clearFlagsConfirmText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: CLIENT_PROFILE_TEXTS.confirmYes,
      cancelButtonText: CLIENT_PROFILE_TEXTS.confirmNo,
      confirmButtonColor: '#10b981'
    });

    if (result.isConfirmed) {
      clearSecurityFlags(client.id);
      Swal.fire({
        icon: 'success',
        title: CLIENT_PROFILE_TEXTS.clearFlagsSuccessTitle,
        text: CLIENT_PROFILE_TEXTS.clearFlagsSuccessText,
        confirmButtonColor: '#ffc000'
      });
      onClose();
    }
  };

  const handleRedeemPoints = () => {
    alert(`Tienes ${client.loyaltyPoints} puntos disponibles.\n\nRecompensas disponibles:\n• 100 pts: Descuento 10%\n• 200 pts: Servicio Gratis\n• 300 pts: Descuento 25%`);
  };

  return {
    handleClearSecurityFlags,
    handleRedeemPoints
  };
};
