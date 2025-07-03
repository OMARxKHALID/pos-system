import { Badge } from "./badge";

export function OrderStatusBadge({ status }) {
  let color = "secondary";
  let label = status;
  switch (status) {
    case "pending":
      color = "secondary";
      label = "Pending";
      break;
    case "paid":
      color = "default";
      label = "Paid";
      break;
    case "cancelled":
      color = "destructive";
      label = "Cancelled";
      break;
    default:
      color = "secondary";
      label = status || "Unknown";
  }
  return (
    <Badge variant={color} className="capitalize px-2 py-0.5 text-xs">
      {label}
    </Badge>
  );
}
