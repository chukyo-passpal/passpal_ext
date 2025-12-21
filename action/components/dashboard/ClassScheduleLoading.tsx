import { Clock } from "lucide-react";

/**
 * ClassScheduleのローディング状態を表示するコンポーネント
 */
export const ClassScheduleLoading: React.FC = () => {
    return (
        <div className="mx-auto mt-8 max-w-md rounded-lg border-2 border-gray-300 bg-gray-100 p-6">
            <div className="text-center">
                <Clock className="mx-auto mb-2 h-8 w-8 text-gray-600" />
                <p className="text-gray-600">時間割情報を読み込んでいます...</p>
            </div>
        </div>
    );
};
