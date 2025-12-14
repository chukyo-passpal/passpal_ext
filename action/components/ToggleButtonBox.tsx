interface ToggleButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
    label: string;
    description: string;
}

const ToggleButtonBox: React.FC<ToggleButtonProps> = ({ icon, label, description, ...props }) => {
    return (
        <label className="group border-neutral-gray-200 hover:border-primary flex w-full cursor-pointer items-center justify-between rounded-[8px] border p-4 transition">
            <div className="flex items-center gap-3">
                {
                    <span className="text-neutral-gray-600 group-has-[input:checked]:text-primary transition">
                        {icon}
                    </span>
                }
                <div>
                    <p className="text-neutral-black text-[14px] font-medium">{label}</p>
                    <p className="text-neutral-gray-600 text-[12px]">{description}</p>
                </div>
            </div>
            <input type="checkbox" {...props} className="peer sr-only" />
            <div
                className={[
                    "bg-neutral-gray-200 relative h-[22px] w-[40px] rounded-full transition-colors duration-200",
                    "after:absolute after:top-[2px] after:left-[2px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:transition-transform after:duration-200 after:content-['']",
                    "peer-checked:bg-status-success peer-checked:after:translate-x-[18px]",
                ].join(" ")}
            />
        </label>
    );
};

export default ToggleButtonBox;
