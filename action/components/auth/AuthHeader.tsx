export interface AuthHeaderProps {
	title: string;
	comment: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, comment }) => {
	return (
		<div className="w-full m-0 p-0 flex flex-col gap-[12px] items-center justify-center">
			<h2 className="text-primary text-[28px] font-bold text-center">PassPal</h2>
			<p className="text-neutral-black text-[18px] font-semibold text-center">{title}</p>
			<p className="text-[#6B7280] text-[14px] font-normal text-center">{comment}</p>
		</div>
	);
};

export default AuthHeader;
