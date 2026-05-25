import { Link } from "react-router";

interface BreadcrumbProps {
  pageTitle: string;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle }) => {
  return (
    <div className="relative mb-8">
      <div className="pointer-events-none absolute -top-4 -left-4 h-24 w-64 rounded-full bg-gradient-to-br from-brand-500/10 via-purple-500/8 to-transparent blur-2xl dark:from-brand-500/20 dark:via-purple-500/15" />
      <nav className="relative mb-3">
        <ol className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-brand-600 dark:text-gray-500 dark:hover:text-brand-400 transition-colors"
              to="/home"
            >
              Əsas
              <svg
                className="stroke-current"
                width="14"
                height="14"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li className="text-brand-600 dark:text-brand-400">{pageTitle}</li>
        </ol>
      </nav>
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {pageTitle}
        </h2>
        <span className="h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-purple-500" />
      </div>
    </div>
  );
};

export default PageBreadcrumb;
