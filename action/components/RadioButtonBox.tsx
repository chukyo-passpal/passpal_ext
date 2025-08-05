import { Check } from "lucide-react";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon: React.ReactNode;
	title: string;
	subTitle: string;
}

const RadioButtonBox: React.FC<RadioButtonProps> = ({ icon, title, subTitle, ...props }) => {
	return (
		<label
			className="group w-full h-[56px] px-4 flex items-center justify-between rounded-[8px]
								border border-neutral-gray-200 cursor-pointer transition
							hover:border-primary has-[:checked]:bg-primary-light has-[:checked]:border-2 has-[:checked]:border-primary"
		>
			<div className="flex items-center gap-3">
				<span className="text-white p-[6px] bg-primary rounded-[8px]">{icon}</span>
				<div>
					<p className="text-[14px] font-semibold text-neutral-black">{title}</p>
					<p className="text-[12px] text-neutral-gray-600">{subTitle}</p>
				</div>
			</div>
			<input type="radio" {...props} className="sr-only peer" />
			<div
				className={[
					"relative flex items-center justify-center w-[20px] h-[20px] bg-white rounded-full",
					"border-[#D1D5DB] border-2",
					"peer-checked:bg-primary peer-checked:border-primary transition-colors duration-200",
				].join(" ")}
			>
				<Check size={12} className="text-white" />
			</div>
		</label>
	);
};

export default RadioButtonBox;
