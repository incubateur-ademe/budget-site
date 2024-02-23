import { type ErrorPageParam } from "@auth/core/types";
import { redirect, RedirectType } from "next/navigation";

interface ErrorLoginPageProps {
  searchParams: {
    error: ErrorPageParam;
  };
}

const ErrorLoginPage = ({ searchParams: { error } }: ErrorLoginPageProps) => {
  redirect(`/error?source=login-${error}`, RedirectType.replace);
};

export default ErrorLoginPage;
