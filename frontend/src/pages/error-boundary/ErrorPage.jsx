import { useRouteError, Link } from "react-router-dom";
import Button from "../../components/ui/Button";

function ErrorPage() {
  useRouteError();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-center px-4">
      
      <h1 className="text-md font-medium text-slate-900">
        Not Found
      </h1>

      <p className="text-sm text-slate-500">
        The page you are looking for doesn’t exist.
      </p>

      <Link to="/">
        <Button>Go Home</Button>
      </Link>

    </div>
  );
}

export default ErrorPage;