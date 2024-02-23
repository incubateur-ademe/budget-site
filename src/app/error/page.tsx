import { ErrorDisplay, errors } from "../ErrorDisplay";

interface ErrorPageProps {
  searchParams: {
    source?: `login-${"AuthorizedCallbackError"}`;
  };
}

const Error = ({ searchParams: { source } }: ErrorPageProps) => (
  <>
    <ErrorDisplay code={source && source in errors ? source : "500"} />
  </>
);

export default Error;
