import { useState, useCallback } from 'react';
import { useAuthStore, useBranchStore } from '../../stores';
import { validateImageFile, fileToBase64 } from '../../utils/settings/settingsUtils';
import { AVATAR_VALIDATION, ERROR_MESSAGES } from '../../constants/settings';

/**
 * Hook para manejar configuraciones de perfil
 */
export const useProfileSettings = () => {
  const { user, updateUser } = useAuthStore();
  const { branches, loadBranches } = useBranchStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    preferredBranch: user?.preferredBranch || ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const handleAvatarUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar archivo
    const validation = validateImageFile(file, AVATAR_VALIDATION.MAX_SIZE);
    if (!validation.valid) {
      alert(ERROR_MESSAGES[validation.error]);
      return;
    }

    setAvatarFile(file);

    try {
      const base64 = await fileToBase64(file);
      setAvatarPreview(base64);
      setFormData(prev => ({ ...prev, avatar: base64 }));
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      alert(ERROR_MESSAGES.UPLOAD_FAILED);
    }
  }, []);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const handleSave = useCallback(() => {
    updateUser(formData);
  }, [formData, updateUser]);

  return {
    formData,
    avatarPreview,
    branches,
    handleAvatarUpload,
    updateFormData,
    handleSave,
    loadBranches,
    user
  };
};
