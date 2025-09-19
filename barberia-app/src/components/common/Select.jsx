import { FORM_STYLES, cn } from '../../styles/components';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  error = '',
  required = false,
  disabled = false,
  className = '',
  renderOption = null,
  ...props
}) => {
  const selectClasses = cn(
    FORM_STYLES.input.base.replace('px-4 py-3', 'px-3 py-2'), // Ajustar padding para select
    error && FORM_STYLES.input.error,
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const defaultRenderOption = (option) => {
    if (typeof option === 'string') {
      return { value: option, label: option };
    }
    return {
      value: option.value ?? option.id,
      label: option.label ?? option.name ?? option.value ?? option.id
    };
  };

  const renderFn = renderOption || defaultRenderOption;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={name}
          className={cn(
            FORM_STYLES.label.base,
            required && FORM_STYLES.label.required
          )}
        >
          {label}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={selectClasses}
        {...props}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option, index) => {
          const { value: optionValue, label: optionLabel } = renderFn(option);
          return (
            <option key={optionValue || index} value={optionValue}>
              {optionLabel}
            </option>
          );
        })}
      </select>

      {error && (
        <p className={FORM_STYLES.error}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;