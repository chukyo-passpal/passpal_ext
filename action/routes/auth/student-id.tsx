import { Link, createFileRoute } from "@tanstack/react-router";

const StudentIdPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1>StudetId</h1>
      <Link
        to="/auth/google-auth"
        className="bg-primary text-white rounded px-4 py-2 text-center"
      >
        Google認証
      </Link>
    </div>
  );
};

export const Route = createFileRoute("/auth/student-id")({
  component: StudentIdPage,
});
