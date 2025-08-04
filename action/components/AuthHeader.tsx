interface AuthHeaderProps {
	title: string;
	comment: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, comment }) => {
	return (
		<div className="w-full flex flex-col gap-2 items-center justify-center">
			<h2 className="text-primary text-[28px] font-bold text-center">PassPal</h2>
			<p className="text-neutral-black text-[18px] font-semibold text-center">{title}</p>
			<p className="text-neutral-gray-600 text-[14px] text-center">{comment}</p>
		</div>
	);
};

export default AuthHeader;
