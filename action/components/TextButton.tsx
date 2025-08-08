import { twMerge } from "tailwind-merge";

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const TextButton: React.FC<TextButtonProps> = ({ children, className, ...props }) => {
	return (
		<button
			className={twMerge(["text-primary text-left text-[14px] font-medium cursor-pointer hover:underline", className])}
			{...props}
		>
			{children}
		</button>
	);
};

export default TextButton;
