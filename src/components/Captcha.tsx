import React, { useEffect, useRef } from 'react';

type CharMap = 'upper' | 'lower' | 'numbers' | 'special_char' | '';

interface CaptchaProps {
    numberOfCharacters: number;
    backgroundColor?: string;
    fontColor?: string;
    charMap?: CharMap;
    reloadText?: string;
    reloadColor?: string;
    height?: number;
    padding?: number;
    onChange?: (value: string) => void;
    setReloadCaptcha: (value: boolean) => void;
}

export const generateCaptcha = (
    length: number,
    charMap: CharMap = ''
): string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = "~`!@#$%^&*()_+-=[]{}\\|:'<>,.?/";

    let charset = lowercase + uppercase + numbers;
    if (charMap === 'upper') charset = uppercase + numbers;
    else if (charMap === 'lower') charset = lowercase + numbers;
    else if (charMap === 'numbers') charset = numbers;
    else if (charMap === 'special_char') charset = special;

    let result = '';
    const hasAllTypes = charMap === '' || charMap === 'upper' || charMap === 'lower';
    if (hasAllTypes && length >= 3) {
        result += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
        result += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
        result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        for (let i = 3; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        result = result.split('').sort(() => 0.5 - Math.random()).join('');
    } else {
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
    }

    return result;
};

export const validateCaptcha = (input: string, actual: string): boolean => {
    return input === actual;
};

export const Captcha = ({
    numberOfCharacters,
    backgroundColor = 'white',
    fontColor = 'black',
    charMap = '',
    reloadText = 'Reload Captcha',
    reloadColor = 'black',
    onChange,
    setReloadCaptcha,
    height = 55,
    padding = 15,
}: CaptchaProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawCaptcha = (text: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const length = text.length;
        const charWidth = 20;

        canvas.width = length * charWidth + padding * 2;
        // canvas.height = height + padding * 2;
        canvas.height = height;

        // Draw background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textBaseline = "middle";
        ctx.font = "italic 20px Monospace";
        ctx.fillStyle = fontColor;

        for (let i = 0; i < length; i++) {
            const x = charWidth * i + padding;
            const y = Math.floor(Math.random() * 10) + canvas.height / 2;
            ctx.fillText(text[i], x, y);
        }
    };


    const reloadCaptcha = () => {
        const newCaptcha = generateCaptcha(numberOfCharacters, charMap);
        if (onChange) onChange(newCaptcha);
        drawCaptcha(newCaptcha);
    };

    useEffect(() => {
        reloadCaptcha();
    }, [numberOfCharacters, charMap]);

    useEffect(() => {
        return () => { setReloadCaptcha(false) }
    }, [])

    return (
        <>
            <div className='captcha-container me-3'>
                <div className="d-flex align-items-center gap-2">
                    <canvas ref={canvasRef} className="d-flex align-self-start" />
                    <button
                        onClick={reloadCaptcha}
                        type="button"
                        tabIndex={4}
                        className='captcha-relod-btn c-content-19'
                        style={{ cursor: 'pointer', color: reloadColor, background: 'none', border: 'none', padding: 0 }}
                        title="Reload Captcha"
                    >
                        <i className="icon-refresh-cw" style={{ fontSize: '20px' }} />
                    </button>
                </div>
            </div>
        </>
    );
};