import { FiStar } from 'react-icons/fi';

/**
 * Paso 3: Portafolio de Trabajos
 */
const PortfolioGallery = ({ portfolioImages, onSelectImage, onSkip }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          Explora nuestros trabajos
        </h3>
        <p className="mb-4 text-gray-600">
          Mira algunos ejemplos de los estilos que realizamos
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {portfolioImages.map(image => (
            <div
              key={image.id}
              onClick={() => onSelectImage(image)}
              className="relative overflow-hidden transition-transform rounded-lg cursor-pointer group hover:scale-105"
            >
              <div className="aspect-[3/4] bg-gray-200">
                <img
                  src={image.image}
                  alt={image.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x500/f3f4f6/9ca3af?text=${encodeURIComponent(image.style)}`;
                  }}
                />
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-full p-3 text-white">
                  <p className="text-sm font-bold">{image.title}</p>
                  <p className="text-xs opacity-90">{image.style}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs">{image.barber}</p>
                    <div className="flex items-center">
                      <FiStar className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{image.rating}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {image.tags?.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Saltar este paso
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioGallery;
