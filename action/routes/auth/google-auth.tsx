import { Link, createFileRoute } from "@tanstack/react-router";

const GoogleAuthPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>GoogleAuth</h1>
      <Link
        to="/auth/password"
        className="bg-primary text-white rounded px-4 py-2 text-center"
      >
        パスワード入力
      </Link>
    </div>
  );
};

export const Route = createFileRoute("/auth/google-auth")({
  component: GoogleAuthPage,
});
