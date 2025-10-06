import { useState, useEffect } from 'react';
import { FiPlay, FiX, FiAlertCircle, FiCheck, FiUsers, FiCalendar } from 'react-icons/fi';
import { DemoService } from '../../services/demoService';
import { useClientStore, useAppointmentStore, useAuthStore } from '../../stores';
import Swal from 'sweetalert2';

/**
 * COMPONENTE DE CONTROL DE MODO DEMO
 * 
 * Proporciona una interfaz para activar/desactivar el modo de simulación
 * y guiar al usuario a través del flujo de prueba del sistema de vouchers falsos.
 * 
 * CARACTERÍSTICAS:
 * - Solo visible para roles admin y superadmin
 * - Botón discreto en el header cuando está desactivado
 * - Panel flotante con controles cuando está activo
 * - Guía paso a paso integrada
 * 
 * FLUJO DE USO:
 * 1. Admin hace click en "Demo" → Se activa el modo y se crean datos
 * 2. Aparece panel flotante con acciones rápidas
 * 3. Usuario puede ver guía o navegar a las secciones relevantes
 * 4. Al desactivar, todos los datos demo se eliminan automáticamente
 */
const DemoModeControl = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const { user } = useAuthStore();
  const clientStore = useClientStore();
  const appointmentStore = useAppointmentStore();

  useEffect(() => {
    setIsDemoMode(DemoService.isDemoMode());
  }, []);

  // Solo mostrar para admin y superadmin
  if (!user || (user.role !== 'super_admin' && user.role !== 'branch_admin')) {
    return null;
  }

  /**
   * Maneja la activación/desactivación del modo demo
   * 
   * AL ACTIVAR:
   * - Muestra confirmación con información sobre los datos que se crearán
   * - Inyecta 4 clientes y 3 citas de demo
   * - Muestra el panel de control automáticamente
   * 
   * AL DESACTIVAR:
   * - Pide confirmación antes de eliminar datos
   * - Limpia todos los registros con prefijo "DEMO_"
   * - Oculta el panel de control
   */
  const handleToggleDemo = async () => {
    const newState = DemoService.toggleDemoMode();
    setIsDemoMode(newState);

    if (newState) {
      // Activar modo demo
      const result = await Swal.fire({
        title: 'Activar Modo Demo',
        html: `
          <div class="text-left">
            <p class="mb-4">Se crearán datos de prueba para simular el sistema de vouchers falsos:</p>
            <ul class="list-disc ml-6 space-y-1 text-sm">
              <li>4 clientes con diferentes estados de seguridad</li>
              <li>3 citas con pagos pendientes de verificación</li>
              <li>Historial de vouchers rechazados</li>
            </ul>
            <p class="mt-4 text-yellow-600 font-medium">
              <svg class="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Los datos de demo tienen prefijo "DEMO -" para identificarlos fácilmente
            </p>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Activar Demo',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ffc000'
      });

      if (result.isConfirmed) {
        const stats = DemoService.injectDemoData(clientStore, appointmentStore);
        
        Swal.fire({
          icon: 'success',
          title: 'Modo Demo Activado',
          html: `
            <p>Se han creado:</p>
            <ul class="mt-2 text-sm">
              <li>• ${stats.clients} clientes de demo</li>
              <li>• ${stats.appointments} citas con pagos pendientes</li>
            </ul>
          `,
          confirmButtonColor: '#ffc000'
        });
        
        setShowPanel(true);
      } else {
        // Si cancela, revertir el toggle
        DemoService.toggleDemoMode();
        setIsDemoMode(false);
      }
    } else {
      // Desactivar modo demo
      const result = await Swal.fire({
        title: '¿Desactivar Modo Demo?',
        text: 'Se eliminarán todos los datos de demo creados',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ef4444'
      });

      if (result.isConfirmed) {
        DemoService.cleanDemoData(clientStore, appointmentStore);
        setShowPanel(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Modo Demo Desactivado',
          text: 'Todos los datos de demo han sido eliminados',
          confirmButtonColor: '#ffc000'
        });
      } else {
        // Si cancela, revertir el toggle
        DemoService.toggleDemoMode();
        setIsDemoMode(true);
      }
    }
  };

  /**
   * Muestra la guía completa de simulación
   * 
   * Explica paso a paso cómo usar el modo demo:
   * - Dónde encontrar los pagos pendientes
   * - Qué representa cada cliente demo
   * - Cómo funciona el proceso de verificación
   * - Dónde ver los clientes sospechosos
   * 
   * Esta guía es esencial para que los usuarios entiendan
   * el flujo completo del sistema de seguridad
   */
  const showSimulationGuide = () => {
    Swal.fire({
      title: 'Guía de Simulación',
      html: `
        <div class="text-left space-y-4">
          <div>
            <h4 class="font-bold text-primary-600 mb-2">1. Verificar Pagos Pendientes</h4>
            <p class="text-sm">Ve a <strong>Citas → Pagos pendientes</strong> para ver las 3 citas de demo con diferentes niveles de alerta.</p>
          </div>
          
          <div>
            <h4 class="font-bold text-primary-600 mb-2">2. Tipos de Clientes Demo</h4>
            <ul class="text-sm space-y-1 ml-4">
              <li>• <strong>María García:</strong> Cliente normal sin problemas</li>
              <li>• <strong>Carlos Sospechoso:</strong> 1 voucher falso (advertencia)</li>
              <li>• <strong>Pedro Marcado:</strong> 2 vouchers falsos (marcado 🚨)</li>
              <li>• <strong>Luis Bloqueado:</strong> 3 vouchers falsos (BLOQUEADO)</li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-bold text-primary-600 mb-2">3. Proceso de Verificación</h4>
            <p class="text-sm">Al verificar un pago:</p>
            <ul class="text-sm space-y-1 ml-4">
              <li>• Aparecerán alertas de seguridad para clientes con historial</li>
              <li>• Si rechazas con palabras clave (falso, fake, editado), se marca automáticamente</li>
              <li>• El cliente se bloquea al tercer intento</li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-bold text-primary-600 mb-2">4. Ver Clientes Sospechosos</h4>
            <p class="text-sm">Ve a <strong>Clientes → Clientes sospechosos</strong> para ver todos los clientes marcados y sus historiales.</p>
          </div>
        </div>
      `,
      width: '600px',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ffc000'
    });
  };

  return (
    <>
      {/* BOTÓN FLOTANTE
          Aparece en la esquina inferior derecha cuando el modo demo está activo
          Permite mostrar/ocultar el panel de control */}
      <div className="fixed bottom-6 right-6 z-50">
        {isDemoMode && (
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2"
            title="Panel de Demo"
          >
            <FiPlay className="h-5 w-5" />
            {showPanel && <span className="pr-2">Demo</span>}
          </button>
        )}
      </div>

      {/* PANEL DE CONTROL PRINCIPAL
          Contiene todas las acciones y información del modo demo
          Se muestra cuando el usuario hace click en el botón flotante */}
      {showPanel && isDemoMode && (
        <div className="fixed bottom-20 right-6 z-50 bg-white dark:bg-dark-800 rounded-lg shadow-xl p-4 w-80 border-2 border-yellow-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <FiPlay className="h-5 w-5 text-yellow-500" />
              <span>Modo Demo Activo</span>
            </h3>
            <button
              onClick={() => setShowPanel(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Estado actual */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <FiAlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Datos de prueba activos</span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                4 clientes y 3 citas de demo creadas
              </p>
            </div>

            {/* Acciones rápidas */}
            <div className="space-y-2">
              <button
                onClick={showSimulationGuide}
                className="w-full text-left px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center space-x-2"
              >
                <FiAlertCircle className="h-4 w-4" />
                <span className="text-sm">Ver guía de simulación</span>
              </button>

              <button
                onClick={() => window.location.href = '#/appointments'}
                className="w-full text-left px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center space-x-2"
              >
                <FiCalendar className="h-4 w-4" />
                <span className="text-sm">Ir a pagos pendientes</span>
              </button>

              <button
                onClick={() => window.location.href = '#/clients'}
                className="w-full text-left px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex items-center space-x-2"
              >
                <FiUsers className="h-4 w-4" />
                <span className="text-sm">Ver clientes sospechosos</span>
              </button>
            </div>

            {/* Desactivar demo */}
            <button
              onClick={handleToggleDemo}
              className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <FiX className="h-4 w-4" />
              <span className="text-sm">Desactivar modo demo</span>
            </button>
          </div>
        </div>
      )}

      {/* BOTÓN EN HEADER
          Aparece cuando el modo demo está DESACTIVADO
          Permite activar el modo demo de forma discreta */}
      {!isDemoMode && (
        <button
          onClick={handleToggleDemo}
          className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-1"
          title="Activar modo demo"
        >
          <FiPlay className="h-3 w-3" />
          <span>Demo</span>
        </button>
      )}
    </>
  );
};

export default DemoModeControl;