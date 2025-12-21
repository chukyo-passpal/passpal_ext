import { BookOpen, Coffee, Moon, TreePalm } from "lucide-react";

import type { PeriodType } from "../../utils/classScheduleUtil";

interface ClassScheduleIconProps {
    period: PeriodType;
}

/**
 * 期間タイプに応じたアイコンを表示するコンポーネント
 */
export const ClassScheduleIcon: React.FC<ClassScheduleIconProps> = ({ period }) => {
    switch (period) {
        case "lunch":
        case "break":
            return <Coffee />;
        case "outside":
            return <Moon />;
        case "holiday":
            return <TreePalm />;
        default:
            return <BookOpen />;
    }
};
