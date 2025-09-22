import { FiPlay, FiCheck, FiImage, FiEdit, FiHeart } from 'react-icons/fi';
import {
  SERVICES_TEXTS,
  SERVICES_LIMITS,
  PRICE_CONFIG
} from '../../constants/servicesPage';
import {
  generateFallbackImage,
  getPhotosCountText,
  getDiscountBadge
} from '../../utils/servicesHelpers';

const ServiceCard = ({
  service,
  isServiceFavorite,
  onServiceClick,
  onEditService,
  onToggleFavorite,
  onViewGallery
}) => {
  const handleImageError = (e) => {
    e.target.src = generateFallbackImage(service.name);
  };

  return (
    <div
      onClick={() => onServiceClick(service)}
      className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-yellow-500/20 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 cursor-pointer"
    >
      <ServiceImage
        service={service}
        onImageError={handleImageError}
      />

      <ServiceInfo
        service={service}
        isServiceFavorite={isServiceFavorite}
        onEditService={onEditService}
        onToggleFavorite={onToggleFavorite}
        onViewGallery={onViewGallery}
      />
    </div>
  );
};

const ServiceImage = ({ service, onImageError }) => (
  <div className="relative h-48 bg-gradient-to-br from-yellow-500/10 to-transparent overflow-hidden">
    <img
      src={service.image}
      alt={service.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      onError={onImageError}
    />

    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />

    <ServiceBadges service={service} />
    <VideoIndicator videoUrl={service.videoUrl} />
  </div>
);

const ServiceBadges = ({ service }) => (
  <div className="absolute top-4 left-4 flex flex-col space-y-2">
    {service.popular && (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        {SERVICES_TEXTS.POPULAR_BADGE}
      </span>
    )}
    {service.discount && (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        {getDiscountBadge(service.discount)}
      </span>
    )}
  </div>
);

const VideoIndicator = ({ videoUrl }) => {
  if (!videoUrl) return null;

  return (
    <div className="absolute top-4 right-4">
      <div className="bg-black bg-opacity-50 rounded-full p-2">
        <FiPlay className="h-4 w-4 text-white" />
      </div>
    </div>
  );
};

const ServiceInfo = ({
  service,
  isServiceFavorite,
  onEditService,
  onToggleFavorite,
  onViewGallery
}) => (
  <div className="p-6">
    <ServiceHeader service={service} />
    <ServiceDescription description={service.description} />
    <ServiceFeatures features={service.features} />
    <ServiceActions
      service={service}
      isServiceFavorite={isServiceFavorite}
      onEditService={onEditService}
      onToggleFavorite={onToggleFavorite}
      onViewGallery={onViewGallery}
    />
  </div>
);

const ServiceHeader = ({ service }) => (
  <div className="flex items-start justify-between mb-3">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
      {service.name}
    </h3>
    <div className="text-right">
      <p className="text-xl font-bold text-primary-600">
        {PRICE_CONFIG.CURRENCY}{service.price}
      </p>
      <p className="text-xs text-gray-500">{service.duration} {SERVICES_TEXTS.MINUTES_LABEL}</p>
    </div>
  </div>
);

const ServiceDescription = ({ description }) => (
  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
    {description}
  </p>
);

const ServiceFeatures = ({ features }) => {
  if (!features || features.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {features.slice(0, SERVICES_LIMITS.MAX_FEATURES_DISPLAYED).map((feature, index) => (
        <div key={index} className="flex items-center text-xs text-gray-500">
          <FiCheck className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
          <span>{feature}</span>
        </div>
      ))}
    </div>
  );
};

const ServiceActions = ({
  service,
  isServiceFavorite,
  onEditService,
  onToggleFavorite,
  onViewGallery
}) => (
  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onViewGallery(service);
      }}
      className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
    >
      <FiImage className="h-4 w-4" />
      <span className="text-sm">
        {getPhotosCountText(service.gallery?.length)}
      </span>
    </button>

    <div className="flex items-center space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditService(service);
        }}
        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <FiEdit className="h-4 w-4" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(service.id);
        }}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
      >
        {isServiceFavorite(service.id) ? (
          <FiHeart className="h-4 w-4 fill-current text-red-500" />
        ) : (
          <FiHeart className="h-4 w-4" />
        )}
      </button>
    </div>
  </div>
);

export default ServiceCard;