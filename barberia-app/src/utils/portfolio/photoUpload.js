/**
 * Utilidades para manejo de fotos
 */

/**
 * Leer archivo y convertirlo a Data URL
 */
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve({
        file: file,
        preview: e.target.result,
        name: file.name
      });
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Validar que el archivo sea una imagen
 */
export const isValidImageFile = (file) => {
  if (!file) return false;

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Validar tamaño de archivo (max 5MB por defecto)
 */
export const isValidFileSize = (file, maxSizeMB = 5) => {
  if (!file) return false;

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Generar URL de foto simulada
 * En producción, esto subiría la foto a un servidor y retornaría la URL real
 */
export const generatePhotoURL = (photoType = 'before') => {
  const timestamp = Date.now();
  return `/images/portfolio/${photoType}_${timestamp}.jpg`;
};
