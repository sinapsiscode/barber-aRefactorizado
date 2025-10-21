import { FiUsers, FiGift, FiStar } from 'react-icons/fi';
import { VALIDATION_RULES, LOYALTY_TEXTS } from '../../../../constants/loyaltySettings';

/**
 * Card de bonificaciones especiales
 */
const BonusesConfig = ({ formData, onChange }) => {
  const bonuses = [
    {
      key: 'welcomeBonusPoints',
      icon: FiUsers,
      label: LOYALTY_TEXTS.welcomeBonusLabel,
      helper: LOYALTY_TEXTS.welcomeBonusHelper,
      placeholder: '50'
    },
    {
      key: 'birthdayBonusPoints',
      icon: FiGift,
      label: LOYALTY_TEXTS.birthdayBonusLabel,
      helper: LOYALTY_TEXTS.birthdayBonusHelper,
      placeholder: '100'
    },
    {
      key: 'referralBonusPoints',
      icon: FiStar,
      label: LOYALTY_TEXTS.referralBonusLabel,
      helper: LOYALTY_TEXTS.referralBonusHelper,
      placeholder: '150'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white">{LOYALTY_TEXTS.bonusesTitle}</h4>
      </div>
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bonuses.map((bonus) => {
            const Icon = bonus.icon;
            return (
              <div key={bonus.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Icon className="inline h-4 w-4 mr-1" />
                  {bonus.label}
                </label>
                <input
                  type="number"
                  min={VALIDATION_RULES.bonusPoints.min}
                  value={formData[bonus.key]}
                  onChange={(e) => onChange(bonus.key, parseInt(e.target.value) || 0)}
                  className="input-field"
                  placeholder={bonus.placeholder}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {bonus.helper}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BonusesConfig;
