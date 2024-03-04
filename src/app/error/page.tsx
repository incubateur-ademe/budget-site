import { systemCodes, SystemMessageDisplay } from "../SystemMessageDisplay";

interface ErrorPageProps {
  searchParams: {
    source?: `login-${"AuthorizedCallbackError"}`;
  };
}

const Error = ({ searchParams: { source } }: ErrorPageProps) => (
  <SystemMessageDisplay code={source && source in systemCodes ? source : "500"} />
);

export default Error;
