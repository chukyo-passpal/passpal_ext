import { twMerge } from "tailwind-merge";

interface SettingCardProps {
	children: React.ReactNode;
	title: string;
	border?: boolean;
}

const SettingCard: React.FC<SettingCardProps> = ({ children, title, border = true }) => {
	return (
		<div className="w-full">
			<h2 className="text-[16px] font-semibold text-neutral-black mb-4">{title}</h2>
			<div
				className={twMerge([
					"w-full flex flex-col gap-4 p-0 rounded-[8px]",
					border && "border border-neutral-gray-200 p-4",
				])}
			>
				{children}
			</div>
		</div>
	);
};

export default SettingCard;
