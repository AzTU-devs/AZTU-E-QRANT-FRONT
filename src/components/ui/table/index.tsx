import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface TableProps {
  children: ReactNode;
  className?: string;
}
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}
interface TableRowProps {
  children: ReactNode;
  className?: string;
}
interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
  colSpan?: number;
}
interface TableFooterProps {
  children: ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className }) => {
  return (
    <table
      className={twMerge(
        "min-w-full text-left text-sm border-separate border-spacing-0",
        className
      )}
    >
      {children}
    </table>
  );
};

const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return (
    <thead
      className={twMerge(
        "bg-gradient-to-b from-brand-50/70 to-brand-50/30 dark:from-white/[0.05] dark:to-white/[0.02] sticky top-0 z-10",
        className
      )}
    >
      {children}
    </thead>
  );
};

const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return (
    <tbody
      className={twMerge("[&>tr]:transition-colors", className)}
    >
      {children}
    </tbody>
  );
};

const TableFooter: React.FC<TableFooterProps> = ({ children, className }) => {
  return (
    <tfoot
      className={twMerge(
        "bg-gray-50/60 dark:bg-white/[0.02] font-semibold",
        className
      )}
    >
      {children}
    </tfoot>
  );
};

const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return (
    <tr
      className={twMerge(
        "group hover:bg-brand-50/40 dark:hover:bg-white/[0.03]",
        className
      )}
    >
      {children}
    </tr>
  );
};

const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  colSpan,
}) => {
  const CellTag = isHeader ? "th" : "td";
  const base = isHeader
    ? "px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200/70 dark:border-white/[0.06] align-bottom"
    : "px-5 py-3.5 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100/80 dark:border-white/[0.04] align-middle";

  return (
    <CellTag className={twMerge(base, className)} colSpan={colSpan}>
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableCell };
