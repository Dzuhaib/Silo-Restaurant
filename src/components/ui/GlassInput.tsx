import { InputHTMLAttributes, forwardRef } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="glass-input-group">
                {label && <label>{label}</label>}
                <input
                    ref={ref}
                    className={`glass-input ${className}`.trim()}
                    style={error ? { borderColor: "rgba(239,68,68,0.5)" } : undefined}
                    {...props}
                />
                {error && (
                    <p style={{ fontSize: "0.75rem", color: "#f87171", marginLeft: 4 }}>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

GlassInput.displayName = "GlassInput";
