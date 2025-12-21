import type { Class } from "../../../utils/timetable";

interface ClassInfoProps {
    currentClass: Class | null;
}

/**
 * 授業情報（授業名、担当教員、教室）を表示するコンポーネント
 */
export const ClassInfo: React.FC<ClassInfoProps> = ({ currentClass }) => {
    if (!currentClass) return null;

    return (
        <div className="flex flex-col gap-1">
            <p className="text-[16px] font-medium text-[#2D2D30]">{currentClass.name}</p>
            {currentClass.teacher && <p className="text-[14px] text-[#6B7280]">担当: {currentClass.teacher}</p>}
            {currentClass.classroom && <p className="text-[14px] text-[#6B7280]">教室: {currentClass.classroom}</p>}
        </div>
    );
};
