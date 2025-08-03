import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: "text" | "password";
  icon?: React.ReactNode;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  icon,
  label,
  placeholder,
  type,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputType = showPassword ? "text" : type;
  const id = useId();

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label
          className="block text-[16px] font-[inherit] text-neutral-black"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          className={[
            "peer w-full h-14 border border-neutral-gray-200 border-2 rounded-[8px] transition outline-none",
            "placeholder:text-neutral-gray-600 text-[16px]",
            "text-[16px] font-normal font-[inherit]",
            "focus:border-primary",
            error && "border-status-error",
            icon && "pl-10",
          ].join(" ")}
          {...props}
        />
        {icon && (
          <span className="text-neutral-gray-600 absolute inset-y-0 left-3 flex items-center transition peer-focus:text-primary">
            {icon}
          </span>
        )}
        {type === "password" && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowPassword(!showPassword)}
            className="peer-focus:text-primary absolute inset-y-0 right-3 flex items-center cursor-pointer transition hover:scale-125 text-gray-400 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="text-inherit" size={20} />
            ) : (
              <Eye className="text-inherit" size={20} />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-status-error text-[14px] font-[inherit]">{error}</p>
      )}
    </div>
  );
};

export default InputField;
