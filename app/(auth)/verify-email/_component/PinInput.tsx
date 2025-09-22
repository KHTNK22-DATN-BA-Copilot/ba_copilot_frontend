interface Props {
    pin: string[];
    inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    isVerifying: boolean;
    onChange: (i: number, v: string) => void;
    onKeyDown: (i: number, e: React.KeyboardEvent) => void;
    onPaste: (e: React.ClipboardEvent) => void;
}

export default function PinInput({ pin, inputRefs, isVerifying, onChange, onKeyDown, onPaste }: Props) {
    return (
        <div className="flex justify-center space-x-1.5">
            {pin.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => onChange(index, e.target.value)}
                    onKeyDown={(e) => onKeyDown(index, e)}
                    onPaste={onPaste}
                    disabled={isVerifying}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                />
            ))}
        </div>
    )
}