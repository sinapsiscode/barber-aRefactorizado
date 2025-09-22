import { useAppInitialization } from './hooks/useAppInitialization';
import { useAppRouter } from './hooks/useAppRouter';
import AppLayout from './components/app/AppLayout';
import { REFACTOR_TODOS } from './constants/appConfig';

/**
 * TODO REFACTOR - ROUTING CRÍTICO (Prioridad: {REFACTOR_TODOS.ROUTING.PRIORITY})
 *
 * PROBLEMAS IDENTIFICADOS:
 * {REFACTOR_TODOS.ROUTING.PROBLEMS.map(problem => ` * ${problem}`).join('\n')}
 *
 * PLAN DE REFACTOR:
 * {REFACTOR_TODOS.ROUTING.PLAN.map(step => ` * - ${step}`).join('\n')}
 */

function App() {
  // Inicialización de la aplicación y carga de datos
  const { isAuthenticated, user } = useAppInitialization();

  // Sistema de routing (temporal hasta implementar React Router)
  const { currentPage, handlePageChange } = useAppRouter(user, isAuthenticated);

  return (
    <AppLayout
      isAuthenticated={isAuthenticated}
      user={user}
      currentPage={currentPage}
      onPageChange={handlePageChange}
    />
  );
}

export default App;