import { Link, createFileRoute } from "@tanstack/react-router";

const PasswordPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>Password</h1>
      <Link
        to="/auth/init-setting"
        className="bg-primary text-white rounded px-4 py-2 text-center"
      >
        初期設定
      </Link>
    </div>
  );
};

export const Route = createFileRoute("/auth/password")({
  component: PasswordPage,
});
