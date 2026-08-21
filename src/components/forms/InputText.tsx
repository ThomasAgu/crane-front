'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Validator } from '@/lib/validators/ValidatorInterface';
import styles from './InputText.module.css'
import { requiredValidator } from '@/lib/validators/RequiredValidator';

interface props {
    label: string;
    type: string;
    placeholder?: string;
    value: string;
    setValue: (v: string) => void;
    imagesrc?: string;
    imagealt?: string;
    liveValidators?: Validator[];
    submitValidators?: Validator[];
    showErrors?: boolean;
    errorInline?: string;
    setShowError: Function,
    onValidityChange?: (isValid: boolean) => void;
    disabled?: boolean;
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
    setShowError,
    onValidityChange,
    disabled = false
}) => {
    const [error, setError] = useState<string | null>(null);

    const isValid = (): boolean => {
        for (const validator of [...liveValidators, ...submitValidators]) {
            if (!validator.isValid(value)) {
                return false;
            }
        }
        return true;
    };

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
        const checkIsValid = () => {
            for (const validator of [...liveValidators, ...submitValidators]) {
                if (!validator.isValid(value)) {
                    
                    if (showErrors || liveValidators.includes(validator)) {
                        setError(validator.message);
                        return false;
                    }
                }
            }
            setError(null);
            return true;
        };

        const valid = checkIsValid();
        
        if (onValidityChange) {
            onValidityChange(valid);
        }
    }, [value, showErrors]);

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

    const hasRequiredValidator = () => {
        const validators = [...liveValidators, ...submitValidators];
        return validators.some(v => v === requiredValidator);
    }

    return (
        <main>
            {/* Si no tiene requiredValidator entonces no deberia tener la marca */}
            <label className={styles.label}>{label} {hasRequiredValidator() && <span className={styles.requiredMark}>*</span>}</label>
            <div className={styles.inputWrapper}>
                {(imagesrc && imagealt) && <Image
                    src={imagesrc}
                    alt={imagealt}
                    width={30}
                    height={30}
                    className={styles.inputIcon}
                />}
                <input
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`${imagesrc ? styles.inputWithIcon : styles.input} ${error ? styles.errorInput : ''} ${disabled ? styles.disabledInput : ''}`}
                    value={value}
                    onChange={handleChange}
                />
                {error && <p className={styles.errorInline}>{error}</p>}
            </div>
        </main>
    )
}

export default InputText