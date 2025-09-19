import { useBranchStore } from '../../stores';

const BranchStatus = ({ branchId, showText = true, className = '' }) => {
  const { isBranchOpen, getBranchOperatingHours } = useBranchStore();
  
  if (!branchId) return null;
  
  const isOpen = isBranchOpen(branchId);
  const now = new Date();
  const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
  const hours = getBranchOperatingHours(branchId, currentDay);
  
  if (!hours) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Indicador visual */}
      <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
      
      {showText && (
        <div className="text-sm">
          <span className={`font-medium ${isOpen ? 'text-green-600' : 'text-red-600'}`}>
            {isOpen ? 'Abierto' : 'Cerrado'}
          </span>
          {hours.open && hours.close && (
            <span className="text-gray-500 ml-1">
              • {hours.open} - {hours.close}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default BranchStatus;