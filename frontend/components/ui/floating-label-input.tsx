import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({ label, id, error, value, defaultValue, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(!!(value || defaultValue || ''));
  }, [value, defaultValue]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          {...props}
          value={value}
          defaultValue={defaultValue}
          className="h-14 pt-4 peer bg-white/5 border-white/20"
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            setHasValue(e.target.value !== '');
          }}
          onChange={(e) => {
            setHasValue(e.target.value !== '');
            if (props.onChange) props.onChange(e);
          }}
        />
        <Label
          htmlFor={id}
          className={`absolute left-3 transition-all duration-200 ${
            isFocused || hasValue
              ? 'top-1 text-xs text-primary'
              : 'top-4 text-base text-muted-foreground'
          }`}
        >
          {label}
        </Label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
