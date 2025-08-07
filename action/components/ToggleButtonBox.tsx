interface ToggleButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon: React.ReactNode;
	label: string;
	description: string;
}

const ToggleButtonBox: React.FC<ToggleButtonProps> = ({ icon, label, description, ...props }) => {
	return (
		<label className="group w-full h-[68px] flex items-center justify-between border border-neutral-gray-200 rounded-[8px] cursor-pointer px-4 transition hover:border-primary">
			<div className="flex items-center gap-3">
				{<span className="text-neutral-gray-600 transition group-has-[input:checked]:text-primary">{icon}</span>}
				<div>
					<p className="text-[14px] font-medium text-neutral-black">{label}</p>
					<p className="text-[12px] text-neutral-gray-600">{description}</p>
				</div>
			</div>
			<input type="checkbox" {...props} className="sr-only peer" />
			<div
				className={[
					"relative w-[40px] h-[22px] bg-neutral-gray-200 rounded-full transition-colors duration-200",
					"after:absolute after:content-[''] after:w-[18px] after:h-[18px] after:left-[2px] after:top-[2px] after:bg-white after:rounded-full after:transition-transform after:duration-200",
					"peer-checked:bg-status-success peer-checked:after:translate-x-[18px]",
				].join(" ")}
			/>
		</label>
	);
};

export default ToggleButtonBox;
