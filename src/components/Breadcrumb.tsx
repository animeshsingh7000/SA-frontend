import { ReactNode } from "react";

export default function Breadcrumb({
  icon,
  iconAlt,
  heading,
  description,
  breadcrumbModuleClassName,
  breadcrumbModuleRowClassName = "align-items-start",
}: {
  icon?: string;
  iconAlt?:string;
  heading: string;
  description: string | ReactNode;
  breadcrumbModuleClassName?: string;
  breadcrumbModuleRowClassName?: string;
}) {
  return (
    <div className={`breadcrumb-module ${breadcrumbModuleClassName}`}>
      <div className="container">
        <div className={`breadcrumb-row ${breadcrumbModuleRowClassName}`}>
          {icon && (
            <div className="breadcrumb-icon">
              <img src={icon} alt={iconAlt} />
            </div>
          )}
          <div className="breadcrumb-content">
            <h4>{heading}</h4>
            <p className="mb-0">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
