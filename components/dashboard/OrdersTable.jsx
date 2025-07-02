import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusMap = {
  open: { label: "Completed", variant: "default" },
  busy: { label: "In Progress", variant: "secondary" },
  pending: { label: "Pending", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "destructive" },
};

function formatDateTime(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

const OrdersTable = ({
  date,
  setDate,
  timeFrom,
  setTimeFrom,
  timeTo,
  setTimeTo,
  orders = [],
  onDetail = () => {},
}) => (
  <Card className="mx-2">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-semibold">All Orders</CardTitle>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50">
          <Calendar className="w-4 h-4 text-gray-400" />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-8 p-0 bg-transparent border-0 w-28"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50">
          <span className="text-xs text-gray-400">Time:</span>
          <Input
            type="time"
            value={timeFrom}
            onChange={(e) => setTimeFrom(e.target.value)}
            className="w-16 h-8 p-0 bg-transparent border-0"
          />
          <span className="text-xs text-gray-400">-</span>
          <Input
            type="time"
            value={timeTo}
            onChange={(e) => setTimeTo(e.target.value)}
            className="w-16 h-8 p-0 bg-transparent border-0"
          />
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-4 overflow-x-auto">
      <Table className="min-w-[600px] w-full">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Total Payment</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-400 py-8">
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, idx) => (
              <TableRow key={order._id || idx}>
                <TableCell>
                  {order._id ? order._id.slice(-6) : idx + 1}
                </TableCell>
                <TableCell>
                  {order.createdAt ? formatDateTime(order.createdAt) : "-"}
                </TableCell>
                <TableCell>{order.customerName || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={statusMap[order.status]?.variant || "secondary"}
                  >
                    {statusMap[order.status]?.label || order.status}
                  </Badge>
                </TableCell>
                <TableCell>${order.total?.toFixed(2) || "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDetail(order)}
                  >
                    Detail
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default OrdersTable;
