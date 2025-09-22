import ServiceCard from './ServiceCard';
import { SERVICES_TEXTS } from '../../constants/servicesPage';

const ServicesGrid = ({
  filteredServices,
  isServiceFavorite,
  onServiceClick,
  onEditService,
  onToggleFavorite,
  onViewGallery
}) => {
  if (filteredServices.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredServices.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          isServiceFavorite={isServiceFavorite}
          onServiceClick={onServiceClick}
          onEditService={onEditService}
          onToggleFavorite={onToggleFavorite}
          onViewGallery={onViewGallery}
        />
      ))}
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-4">
      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      {SERVICES_TEXTS.NO_SERVICES}
    </h3>
    <p className="text-gray-600 dark:text-gray-400">
      {SERVICES_TEXTS.NO_SERVICES_DESCRIPTION}
    </p>
  </div>
);

export default ServicesGrid;