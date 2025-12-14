import { Check } from "lucide-react";

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode;
    label: string;
    description: string;
}

const RadioButtonBox: React.FC<RadioButtonProps> = ({ icon, label, description, ...props }) => {
    return (
        <label className="group border-neutral-gray-200 hover:border-primary has-[:checked]:bg-primary-light has-[:checked]:border-primary flex h-[56px] w-full cursor-pointer items-center justify-between rounded-[8px] border px-4 transition has-[:checked]:border-2">
            <div className="flex items-center gap-3">
                <span className="bg-primary rounded-[8px] p-[6px] text-white">{icon}</span>
                <div>
                    <p className="text-neutral-black text-[14px] font-semibold">{label}</p>
                    <p className="text-neutral-gray-600 text-[12px]">{description}</p>
                </div>
            </div>
            <input type="radio" {...props} className="peer sr-only" />
            <div className="peer-checked:bg-primary peer-checked:border-primary relative flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-[#D1D5DB] bg-white transition-colors duration-200">
                <Check size={12} className="text-white" />
            </div>
        </label>
    );
};

export default RadioButtonBox;
