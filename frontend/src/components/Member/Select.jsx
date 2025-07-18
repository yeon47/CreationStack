import React, { useState } from 'react';
import styles from './Select.module.css';

const Select = ({ children, value, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');

  const handleValueChange = newValue => {
    setSelectedValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {React.Children.map(children, child => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            isOpen,
            setIsOpen,
            selectedValue,
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            selectedValue,
            onValueChange: handleValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ className = '', children, isOpen, setIsOpen, selectedValue, ...props }) => {
  return (
    <button
      type="button"
      className={`${styles.selectTrigger} ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      {...props}>
      {children}
      <span className={styles.selectIcon}>▼</span>
    </button>
  );
};

const SelectValue = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};

const SelectContent = ({ className = '', children, isOpen, selectedValue, onValueChange }) => {
  if (!isOpen) return null;

  return (
    <div
      className={`${styles.selectContent} ${className}`}
      style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50 }}>
      <div className={styles.selectViewport}>
        {React.Children.map(children, child => {
          if (child.type === SelectItem) {
            return React.cloneElement(child, {
              selectedValue,
              onValueChange,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
};

const SelectItem = ({ className = '', children, value, selectedValue, onValueChange, ...props }) => {
  const isSelected = selectedValue === value;

  return (
    <div className={`${styles.selectItem} ${className}`} onClick={() => onValueChange(value)} {...props}>
      {children}
      {isSelected && <span className={styles.selectItemIndicator}>✓</span>}
    </div>
  );
};

const SelectLabel = ({ className = '', ...props }) => (
  <div className={`${styles.selectLabel} ${className}`} {...props} />
);

const SelectSeparator = ({ className = '', ...props }) => (
  <div className={`${styles.selectSeparator} ${className}`} {...props} />
);

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectLabel, SelectSeparator };
