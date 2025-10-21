import { LOYALTY_TEXTS } from '../../../../constants/loyaltySettings';

/**
 * Card de ejemplo de cálculo de puntos
 */
const CalculationExample = ({ formData }) => {
  const exampleSpend = formData.pointsPerSol * 10;
  const earnedPoints = Math.floor(exampleSpend / formData.pointsPerSol);
  const minimumSpend = (formData.minimumPointsToRedeem * formData.pointsPerSol).toFixed(1);

  return (
    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
      <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-3">
        {LOYALTY_TEXTS.calculationExampleTitle}
      </h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-purple-800 dark:text-purple-200">
            <strong>{LOYALTY_TEXTS.clientSpendsLabel.replace('{value}', exampleSpend.toFixed(1))}</strong>
          </p>
          <p className="text-purple-700 dark:text-purple-300">
            • {LOYALTY_TEXTS.earnsLabel.replace('{value}', earnedPoints)}
          </p>
          <p className="text-purple-700 dark:text-purple-300">
            • {LOYALTY_TEXTS.newClientBonusLabel.replace('{value}', formData.welcomeBonusPoints)}
          </p>
        </div>
        <div>
          <p className="text-purple-800 dark:text-purple-200">
            <strong>{LOYALTY_TEXTS.toRedeemLabel}</strong>
          </p>
          <p className="text-purple-700 dark:text-purple-300">
            • {LOYALTY_TEXTS.minimumLabel.replace('{value}', formData.minimumPointsToRedeem)}
          </p>
          <p className="text-purple-700 dark:text-purple-300">
            • {LOYALTY_TEXTS.equivalentLabel.replace('{value}', minimumSpend)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalculationExample;
