import { twMerge } from "tailwind-merge";

interface SettingCardProps {
    children: React.ReactNode;
    title: string;
    border?: boolean;
}

const SettingCard: React.FC<SettingCardProps> = ({ children, title, border = true }) => {
    return (
        <div className="w-full">
            <h2 className="text-neutral-black mb-4 text-[16px] font-semibold">{title}</h2>
            <div
                className={twMerge([
                    "flex w-full flex-col gap-4 rounded-[8px] p-0",
                    border && "border-neutral-gray-200 border p-4",
                ])}
            >
                {children}
            </div>
        </div>
    );
};

export default SettingCard;
