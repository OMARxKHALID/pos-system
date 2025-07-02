const StatusIndicator = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === "open"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {status === "open" ? "Completed" : "In Progress"}
  </span>
);

export default StatusIndicator;
