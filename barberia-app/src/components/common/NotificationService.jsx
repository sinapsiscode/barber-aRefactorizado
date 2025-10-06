import { useState, useEffect } from 'react';
import { FiBell, FiX, FiSend, FiClock } from 'react-icons/fi';
import { useClientStore } from '../../stores';

const NotificationService = ({ forceShow = false, onVisibilityChange }) => {
  const { 
    getClientsForWarning, 
    sendCutoffWarning, 
    updateClientWarningSettings 
  } = useClientStore();
  
  const [pendingWarnings, setPendingWarnings] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const checkWarnings = () => {
      const clients = getClientsForWarning();
      setPendingWarnings(clients);
      if (clients.length > 0 && !forceShow) {
        setIsVisible(true);
      }
    };

    checkWarnings();
    const interval = setInterval(checkWarnings, 60000);

    return () => clearInterval(interval);
  }, [getClientsForWarning, forceShow]);

  // Control manual desde Header
  useEffect(() => {
    if (forceShow) {
      setIsVisible(true);
    }
  }, [forceShow]);

  // Notificar cambios de visibilidad al componente padre
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  const handleSendWarning = async (clientId, clientName) => {
    setSending(true);
    
    const message = `Hola ${clientName}! Hemos notado que no nos has visitado en un tiempo. ¿Te gustaría agendar una cita? Estamos aquí para ayudarte con tu corte ideal. ¡Te esperamos! 💈`;
    
    try {
      const result = await sendCutoffWarning(clientId, message);
      
      if (result.success) {
        setPendingWarnings(prev => prev.filter(client => client.id !== clientId));
        
        if (pendingWarnings.length === 1) {
          setIsVisible(false);
        }
      }
    } catch (error) {
      console.error('Error sending warning:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSnoozeWarning = (clientId, days = 7) => {
    const client = pendingWarnings.find(c => c.id === clientId);
    if (client) {
      const newInterval = client.cutoffWarningInterval + days;
      updateClientWarningSettings(clientId, newInterval, true);
      setPendingWarnings(prev => prev.filter(c => c.id !== clientId));
      
      if (pendingWarnings.length === 1) {
        setIsVisible(false);
      }
    }
  };

  const handleDisableWarnings = (clientId) => {
    updateClientWarningSettings(clientId, 15, false);
    setPendingWarnings(prev => prev.filter(client => client.id !== clientId));
    
    if (pendingWarnings.length === 1) {
      setIsVisible(false);
    }
  };

  if (!isVisible || pendingWarnings.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-yellow-200 dark:border-yellow-700">
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiBell className="h-5 w-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Avisos de Corte
              </h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {pendingWarnings.length} cliente{pendingWarnings.length !== 1 ? 's' : ''} pendiente{pendingWarnings.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {pendingWarnings.map((client) => {
            const daysSinceLastVisit = Math.floor(
              (new Date() - new Date(client.lastVisit)) / (1000 * 60 * 60 * 24)
            );
            
            return (
              <div key={client.id} className="p-4 border-b border-gray-100 dark:border-dark-700 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {client.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {client.phone}
                    </p>
                  </div>
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                    {daysSinceLastVisit} días
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <FiClock className="h-3 w-3 mr-1" />
                  Última visita: {new Date(client.lastVisit).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSendWarning(client.id, client.name)}
                    disabled={sending}
                    className="flex items-center px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 disabled:opacity-50"
                  >
                    <FiSend className="h-3 w-3 mr-1" />
                    Enviar
                  </button>
                  
                  <button
                    onClick={() => handleSnoozeWarning(client.id, 7)}
                    className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
                  >
                    +7d
                  </button>
                  
                  <button
                    onClick={() => handleDisableWarnings(client.id)}
                    className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-b-lg">
          <div className="flex justify-between">
            <button
              onClick={() => {
                pendingWarnings.forEach(client => {
                  handleSendWarning(client.id, client.name);
                });
              }}
              disabled={sending || pendingWarnings.length === 0}
              className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline disabled:opacity-50"
            >
              Enviar todas
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationService;