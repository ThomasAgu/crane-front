import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Validator } from '@/src/lib/validators/ValidatorInterface';
import styles from './InputText.module.css'

interface props {
    label: string;
    type: string;
    placeholder?: string;
    value: string;
    setValue: (v: string) => void;
    imagesrc: string;
    imagealt: string;
    liveValidators?: Validator[];
    submitValidators?: Validator[];
    showErrors?: boolean;
    errorInline?: string;
    setShowError: Function
}

const InputText: React.FC<props> = ({
    label,
    type,
    placeholder,
    value,
    setValue,
    imagesrc,
    imagealt,
    liveValidators = [],
    submitValidators = [],
    showErrors = false,
    setShowError

}) => {
    const [error, setError] = useState<string | null>(null);
    
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);

        for (const validator of liveValidators) {
        if (!validator.isValid(val)) {
            setError(validator.message);
            return;
            }
        }
        
        setShowError(false);
        setError(null);
    };


  useEffect(() => {
    if (showErrors && submitValidators.length > 0) {
      for (const validator of submitValidators) {
        if (!validator.isValid(value)) {      
            setError(validator.message);
            return;
        }
      }
      setError(null);
    }
  }, [showErrors]);

    const areAllValidatorsValid = (): boolean => {
        for (const validator of [...liveValidators, ...submitValidators]) {
            if (!validator.isValid(value)) {
                return false;
            }
        }
    return true;
  };


    return (
        <main>
            <label className={styles.label}>{label} <span className={styles.requiredMark}>*</span></label>
            <div className={styles.inputWrapper}>
           <Image
                src={imagesrc}
                alt={imagealt}
                width={30}
                height={30}
                className={styles.inputIcon}
            />
            <input
              type={type}
              placeholder={placeholder}
              className={styles.input}
              value={value}
              onChange={handleChange}
            />
            {error && <p className={styles.errorInline}>{error}</p>}
          </div>
        </main>
    )
}

export default InputText