const ChangeIndicator = ({ change, prefix = "" }) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const absChange = Math.abs(change);

  if (isNeutral) {
    return (
      <span className="text-white dark:text-gray-100 text-sm font-medium">
        = 0%
      </span>
    );
  }

  return (
    <span className={`text-sm font-medium flex items-center ${
      isPositive ? 'text-green-400' : 'text-orange-400'
    }`}>
      {isPositive ? '↗️' : '↘️'}
      <span className="ml-1">
        {prefix}{isPositive ? '+' : ''}{Math.round(absChange)}%
      </span>
    </span>
  );
};

export default ChangeIndicator;