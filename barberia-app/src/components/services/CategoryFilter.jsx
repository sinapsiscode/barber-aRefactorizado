import { SERVICE_CATEGORIES, CATEGORY_STYLES } from '../../constants/servicesPage';

const CategoryFilter = ({
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {SERVICE_CATEGORIES.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isActive ? CATEGORY_STYLES.ACTIVE : CATEGORY_STYLES.INACTIVE
            }`}
          >
            <Icon className="mr-2" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;