import React from 'react';
import styles from './RadioGroup.module.css';

const RadioGroup = React.forwardRef(({ className = '', children, ...props }, ref) => {
  return (
    <div className={`${styles.radioGroup} ${className}`} role="radiogroup" {...props} ref={ref}>
      {children}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef(({ className = '', value, checked, onChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      className={`${styles.radioGroupItem} ${className}`}
      onClick={() => onChange && onChange(value)}
      ref={ref}
      {...props}>
      {checked && (
        <div className={styles.radioIndicator}>
          <div className={styles.radioIcon} />
        </div>
      )}
    </button>
  );
});

RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
