import { Link, createFileRoute } from "@tanstack/react-router";

const InitSettingPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>InitSetting</h1>
      <Link
        to="/"
        className="bg-primary text-white rounded px-4 py-2 text-center"
      >
        ダッシュボード
      </Link>
    </div>
  );
};

export const Route = createFileRoute("/auth/init-setting")({
  component: InitSettingPage,
});
