import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuthStore, useBranchStore } from '../../stores';
import useBackgroundStore from '../../stores/backgroundStore';

/**
 * TODO REFACTOR - LAYOUT IMPROVEMENTS (Prioridad: MEDIA)
 * 
 * PROBLEMAS:
 * 1. 🔗 PROPS DRILLING: currentPage y onPageChange pasados por toda la app
 * 2. 📱 RESPONSIVIDAD: Mejorar comportamiento mobile
 * 3. 🎨 THEMES: Implementar tema dinámico mejor
 * 
 * PLAN:
 * - Usar React Router en lugar de props drilling
 * - Mejorar responsive design
 * - Context para tema global
 */

const Layout = ({ children, currentPage, onPageChange }) => {
  // TODO REFACTOR: Eliminar cuando implementemos React Router
  // Mobile-first: sidebar colapsado por defecto en mobile, expandido en desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { user } = useAuthStore();
  const { selectedBranch } = useBranchStore();
  const { getCurrentBackgroundStyle, opacity } = useBackgroundStore();

  const currentBranchId = selectedBranch?.id || user?.branchId;
  const { style: backgroundStyle, info: backgroundInfo } = getCurrentBackgroundStyle(user?.role, currentBranchId, user?.id);

  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Fondo personalizable */}
      <div
        className="absolute inset-0 z-0"
        style={backgroundStyle}
      />

      {/* Contenido principal con fondo semi-transparente ajustable */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundColor: `rgba(249, 250, 251, ${1 - opacity})`,
        }}
      />
      <div
        className="absolute inset-0 z-10 dark:block hidden"
        style={{
          backgroundColor: `rgba(17, 24, 39, ${1 - opacity})`,
        }}
      />

      <div className="relative z-20 flex w-full h-full">
        {/* Sidebar - hidden on mobile by default, shown on lg+ */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          currentPage={currentPage}
          onPageChange={onPageChange}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onToggleSidebar={() => {
              // En mobile, toggle del mobile sidebar
              // En desktop, collapse del sidebar normal
              if (window.innerWidth < 1024) {
                setIsMobileSidebarOpen(!isMobileSidebarOpen);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
            onPageChange={onPageChange}
          />

          {/* Main content - responsive padding */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-transparent">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;