interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
}

const TextButton: React.FC<TextButtonProps> = ({ children, ...props }) => {
	return (
		<button className="text-primary text-left text-[14px] font-medium cursor-pointer hover:underline" {...props}>
			{children}
		</button>
	);
};

export default TextButton;
