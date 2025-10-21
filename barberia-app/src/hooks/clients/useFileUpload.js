import { useState, useCallback } from 'react';
import { validateImageFile } from '../../utils/clients/appointmentFormValidation';
import { fileToBase64 } from '../../utils/clients/appointmentFormUtils';
import { FILE_VALIDATION, VALIDATION_MESSAGES } from '../../constants/appointmentForm';
import Swal from 'sweetalert2';

/**
 * Hook para manejar la subida de archivos
 */
export const useFileUpload = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = useCallback(async (e, onSuccess) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar el archivo
    const validation = validateImageFile(
      file,
      FILE_VALIDATION.MAX_SIZE,
      FILE_VALIDATION.ALLOWED_TYPES
    );

    if (!validation.valid) {
      const message = VALIDATION_MESSAGES[validation.error];
      await Swal.fire({
        icon: 'error',
        title: message.title,
        text: message.text,
        confirmButtonColor: '#ffc000'
      });
      return;
    }

    // Convertir a base64
    try {
      const base64 = await fileToBase64(file);
      setPreviewImage(base64);
      setUploadedFile(file);

      if (onSuccess) {
        onSuccess(file, base64);
      }
    } catch (error) {
      console.error('Error al procesar el archivo:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo procesar la imagen',
        confirmButtonColor: '#ffc000'
      });
    }
  }, []);

  const clearFile = useCallback(() => {
    setPreviewImage(null);
    setUploadedFile(null);
  }, []);

  return {
    previewImage,
    uploadedFile,
    handleFileChange,
    clearFile
  };
};
