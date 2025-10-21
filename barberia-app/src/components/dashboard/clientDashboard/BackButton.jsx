/**
 * Botón para volver al dashboard principal
 */
const BackButton = ({ onClick, text = '← Volver al Dashboard' }) => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <button
        onClick={onClick}
        className="text-gray-600 hover:text-gray-900 flex items-center space-x-2"
      >
        <span>{text}</span>
      </button>
    </div>
  );
};

export default BackButton;
