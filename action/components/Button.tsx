import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger";
	children: React.ReactNode;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	isSquare?: boolean;
}

const VARIANT_STYLES = {
	primary: "bg-primary text-white shadow-inherit",
	secondary: "bg-neutral-gray-200 text-neutral-gray-600 shadow-inherit",
	danger: "bg-white text-status-error border border-status-error",
};

const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	isSquare = false,
	children,
	leftIcon,
	rightIcon,
	className,
	...props
}) => {
	return (
		<button
			className={twMerge([
				"group relative w-full h-12 text-[16px] flex cursor-pointer items-center justify-center rounded-full font-bold",
				"transition hover:enabled:-translate-y-0.5 hover:enabled:shadow-lg",
				"disabled:!transform-none disabled:cursor-not-allowed disabled:opacity-60",
				VARIANT_STYLES[variant],
				isSquare && "rounded-[6px]",
				className,
			])}
			type="button"
			{...props}
		>
			{leftIcon && <span className="absolute left-4">{leftIcon}</span>}
			{children}
			{rightIcon && <span className="absolute right-4">{rightIcon}</span>}
		</button>
	);
};

export default Button;
