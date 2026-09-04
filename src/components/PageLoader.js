import { Spin } from "antd";

export default function PageLoader({ rows = 4 }) {
  return (
    <div className="luxury-page-loader" role="status" aria-live="polite">
      <Spin size="large" />
      <div className="luxury-page-loader__skeleton" aria-hidden="true">
        {Array.from({ length: rows }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}
