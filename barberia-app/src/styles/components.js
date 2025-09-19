// ===================================================================
// 🎨 COMPONENTES DE ESTILO REUTILIZABLES - REFACTORIZADO
// ===================================================================
// Clases CSS centralizadas para componentes comunes
// Elimina duplicación de estilos en todo el proyecto

// ===================================================================
// 🔘 BOTONES
// ===================================================================
export const BUTTON_STYLES = {
  // Botones base
  base: `
    inline-flex items-center justify-center
    px-4 py-2 border rounded-md
    font-medium text-sm
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `,

  // Variantes de botones
  variants: {
    primary: `
      bg-primary-600 hover:bg-primary-700 active:bg-primary-800
      text-white border-transparent
      focus:ring-primary-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 active:bg-gray-300
      text-gray-700 border-gray-300
      focus:ring-gray-500
      dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600
    `,
    success: `
      bg-green-600 hover:bg-green-700 active:bg-green-800
      text-white border-transparent
      focus:ring-green-500
    `,
    danger: `
      bg-red-600 hover:bg-red-700 active:bg-red-800
      text-white border-transparent
      focus:ring-red-500
    `,
    warning: `
      bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700
      text-white border-transparent
      focus:ring-yellow-400
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 active:bg-gray-200
      text-gray-700 border-gray-300
      focus:ring-gray-500
      dark:hover:bg-gray-800 dark:text-white dark:border-gray-600
    `
  },

  // Tamaños
  sizes: {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }
};

// ===================================================================
// 📄 TARJETAS
// ===================================================================
export const CARD_STYLES = {
  base: `
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
    rounded-lg shadow-sm
    transition-all duration-200
  `,

  interactive: `
    hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600
    cursor-pointer
  `,

  variants: {
    elevated: 'shadow-lg hover:shadow-xl',
    flat: 'shadow-none border-2',
    outlined: 'shadow-none border-2 border-gray-300 dark:border-gray-600'
  },

  padding: {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  }
};

// ===================================================================
// 📝 FORMULARIOS
// ===================================================================
export const FORM_STYLES = {
  input: {
    base: `
      w-full px-4 py-3
      bg-gray-50 dark:bg-gray-900
      border border-gray-300 dark:border-gray-700
      rounded-md
      text-gray-900 dark:text-gray-100
      placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      focus:bg-white dark:focus:bg-gray-800
      transition-all duration-200
    `,

    error: `
      border-red-500 focus:border-red-500 focus:ring-red-500
      bg-red-50 dark:bg-red-900/20
    `,

    success: `
      border-green-500 focus:border-green-500 focus:ring-green-500
      bg-green-50 dark:bg-green-900/20
    `,

    withIcon: 'pl-10',
    withPassword: 'pr-10'
  },

  label: {
    base: `
      block text-sm font-medium mb-2
      text-gray-700 dark:text-gray-300
      transition-colors duration-200
    `,

    focused: 'text-primary-600 dark:text-primary-400',
    required: 'after:content-["*"] after:text-red-500 after:ml-1'
  },

  error: `
    mt-1 text-sm text-red-600 dark:text-red-400
  `,

  helper: `
    mt-1 text-sm text-gray-500 dark:text-gray-400
  `
};

// ===================================================================
// 📊 TABLAS
// ===================================================================
export const TABLE_STYLES = {
  container: `
    overflow-hidden shadow ring-1 ring-black ring-opacity-5
    rounded-lg border border-gray-200 dark:border-gray-700
  `,

  table: `
    min-w-full divide-y divide-gray-200 dark:divide-gray-700
  `,

  header: {
    row: 'bg-gray-50 dark:bg-gray-800',
    cell: `
      px-6 py-3 text-left text-xs font-medium
      text-gray-500 dark:text-gray-400
      uppercase tracking-wider
    `
  },

  body: {
    row: `
      bg-white dark:bg-gray-900
      hover:bg-gray-50 dark:hover:bg-gray-800
      transition-colors duration-150
    `,

    cell: `
      px-6 py-4 whitespace-nowrap text-sm
      text-gray-900 dark:text-gray-100
    `
  },

  striped: `
    even:bg-gray-50 dark:even:bg-gray-800
  `
};

// ===================================================================
// 🏷️ BADGES Y ETIQUETAS
// ===================================================================
export const BADGE_STYLES = {
  base: `
    inline-flex items-center px-2.5 py-0.5
    rounded-full text-xs font-medium
    transition-all duration-200
  `,

  variants: {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  },

  sizes: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
};

// ===================================================================
// 🔔 NOTIFICACIONES Y ALERTAS
// ===================================================================
export const ALERT_STYLES = {
  base: `
    p-4 rounded-md border-l-4
    flex items-start space-x-3
  `,

  variants: {
    success: `
      bg-green-50 border-green-400 text-green-800
      dark:bg-green-900/20 dark:border-green-500 dark:text-green-200
    `,
    error: `
      bg-red-50 border-red-400 text-red-800
      dark:bg-red-900/20 dark:border-red-500 dark:text-red-200
    `,
    warning: `
      bg-yellow-50 border-yellow-400 text-yellow-800
      dark:bg-yellow-900/20 dark:border-yellow-500 dark:text-yellow-200
    `,
    info: `
      bg-blue-50 border-blue-400 text-blue-800
      dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-200
    `
  }
};

// ===================================================================
// 📱 AVATARES
// ===================================================================
export const AVATAR_STYLES = {
  base: `
    rounded-full flex items-center justify-center
    font-medium text-white
    transition-all duration-200
  `,

  sizes: {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  },

  colors: [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-gray-500'
  ]
};

// ===================================================================
// 📑 ESTADOS VACÍOS
// ===================================================================
export const EMPTY_STATE_STYLES = {
  container: `
    text-center py-12 px-4
  `,

  icon: `
    h-16 w-16 mx-auto mb-4
    text-gray-400 dark:text-gray-600
  `,

  title: `
    text-lg font-medium text-gray-900 dark:text-gray-100
    mb-2
  `,

  description: `
    text-gray-500 dark:text-gray-400
    mb-6
  `
};

// ===================================================================
// 🎛️ UTILIDADES DE LAYOUT
// ===================================================================
export const LAYOUT_STYLES = {
  container: {
    base: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    sm: 'max-w-2xl mx-auto px-4 sm:px-6',
    md: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    lg: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    xl: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8'
  },

  grid: {
    responsive: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
    auto: 'grid grid-cols-auto gap-6',
    '2col': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    '3col': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    '4col': 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'
  },

  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center'
  }
};

// ===================================================================
// 🎨 FUNCIÓN HELPER PARA COMBINAR CLASES
// ===================================================================
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Exportar todo como objeto por defecto
export default {
  BUTTON_STYLES,
  CARD_STYLES,
  FORM_STYLES,
  TABLE_STYLES,
  BADGE_STYLES,
  ALERT_STYLES,
  AVATAR_STYLES,
  EMPTY_STATE_STYLES,
  LAYOUT_STYLES,
  cn
};