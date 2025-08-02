interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

const VARIANT_STYLES = {
  primary: "bg-primary text-white shadow-inherit",
  secondary: "bg-neutral-gray-200 text-neutral-gray-600 shadow-inherit",
  danger: "bg-white text-status-error border border-status-error",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  return (
    <button
      className={[
        "group text-[16px] font-base flex cursor-pointer items-center justify-center rounded-full p-4 font-[inherit] font-bold",
        "transition hover:enabled:-translate-y-0.5 hover:enabled:shadow-lg",
        "disabled:!transform-none disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_STYLES[variant],
      ].join(" ")}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
