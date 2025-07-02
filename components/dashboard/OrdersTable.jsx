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
import StatusIndicator from "./StatusIndicator";

const OrdersTable = ({
  date,
  setDate,
  timeFrom,
  setTimeFrom,
  timeTo,
  setTimeTo,
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
      <Table>
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
          <TableRow>
            <TableCell>001</TableCell>
            <TableCell>2024-05-25 09:00 AM</TableCell>
            <TableCell>George</TableCell>
            <TableCell>
              <StatusIndicator status="open" />
            </TableCell>
            <TableCell>$25.00</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                Detail
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>002</TableCell>
            <TableCell>2024-05-25 08:45 AM</TableCell>
            <TableCell>Anna</TableCell>
            <TableCell>
              <StatusIndicator status="busy" />
            </TableCell>
            <TableCell>$18.00</TableCell>
            <TableCell>
              <Button variant="outline" size="sm">
                Detail
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default OrdersTable;
