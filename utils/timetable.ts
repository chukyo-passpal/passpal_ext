import type { CubicsAsTimetableDTO, ManaboTimetableDTO } from "@chukyo-passpal/web_parser";

/**
 * 曜日の定義
 */
export type DayOfWeek = "月" | "火" | "水" | "木" | "金" | "土" | "日";

/**
 * 時限の定義
 */
export type Period = "1" | "2" | "3" | "4" | "5" | "6" | "7";

/**
 * 統合された授業情報
 */
export type Class = {
    /** 授業名 */
    name: string;
    /** 教員名 */
    teacher: string | null;
    /** 教室 */
    classroom: string | null;
    /** MaNaBo授業ページのURL */
    manaboUrl: string | null;
    /** CUBICS授業詳細ページのURL */
    cubicsUrl: string | null;
    /** 授業コード (CUBICS) */
    lessonCode: string | null;
};

/**
 * 使いやすい時間割データ構造
 */
export type NormalizedTimetable = {
    /** 時間割のタイトル */
    title: string;
    /** 学生情報 (CUBICS) */
    student: {
        id: string;
        name: string;
        faculty: string;
        department: string;
    } | null;
    /** 時間割データ: [曜日][時限] */
    schedule: Record<DayOfWeek, Record<Period, Class | null>>;
};

/**
 * 時間割データを使いやすい形式に変換
 */
export function normalizeTimetable(data: {
    manabo: ManaboTimetableDTO;
    cubics: CubicsAsTimetableDTO;
}): NormalizedTimetable {
    const { manabo, cubics } = data;

    // 曜日のマッピング
    const dayMap: Record<string, DayOfWeek> = {
        月: "月",
        火: "火",
        水: "水",
        木: "木",
        金: "金",
        土: "土",
        日: "日",
    };

    // 初期化: 全ての曜日と時限をnullで埋める
    const schedule: Record<DayOfWeek, Record<Period, Class | null>> = {
        月: { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null },
        火: { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null },
        水: { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null },
        木: { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null },
        金: { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null },
        土: { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null },
        日: { "1": null, "2": null, "3": null, "4": null, "5": null, "6": null, "7": null },
    };

    // CUBICS時間割データでマップを作成（教室情報とURL取得用）
    const cubicsMap = new Map<string, { classroom: string | null; url: string | null; lessonCode: string | null }>();

    cubics.periods.forEach((period) => {
        period.slots.forEach((slot) => {
            if (slot.subject) {
                const key = `${slot.subject}`;
                cubicsMap.set(key, {
                    classroom: slot.classroom,
                    url: slot.detailUrl,
                    lessonCode: slot.lessonCode,
                });
            }
        });
    });

    // MaNaBo時間割データをベースに統合
    manabo.periods.forEach((period, periodIndex) => {
        const periodNumber = (periodIndex + 1).toString() as Period;

        period.slots.forEach((slot) => {
            const day = dayMap[slot.day];
            if (!day || !slot.className) return;

            const cubicsInfo = cubicsMap.get(slot.className);

            schedule[day][periodNumber] = {
                name: slot.className,
                teacher: slot.teacher,
                classroom: cubicsInfo?.classroom || null,
                manaboUrl: slot.href,
                cubicsUrl: cubicsInfo?.url || null,
                lessonCode: cubicsInfo?.lessonCode || null,
            };
        });
    });

    return {
        title: manabo.title,
        student: cubics.student
            ? {
                  id: cubics.student.id,
                  name: cubics.student.name,
                  faculty: cubics.student.faculty,
                  department: cubics.student.department,
              }
            : null,
        schedule,
    };
}
