import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatDateTime, formatCurrency } from "@/utils/pos-utils";
import { OrderStatusBadge } from "@/components/ui/status-badge";

const OrdersTable = ({ orders = [] }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = orders
    .filter((order) =>
      statusFilter && statusFilter !== "all"
        ? order.status === statusFilter
        : true
    )
    .filter((order) => {
      const q = search.toLowerCase();
      return (
        order.customerName?.toLowerCase().includes(q) ||
        order.orderNumber?.toLowerCase().includes(q) ||
        order.items?.some((item) => item.name?.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Responsive: show table on md+ screens, cards on mobile
  return (
    <>
      <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
        <CardHeader className="flex flex-col items-start justify-between px-4 pt-4 pb-3 space-y-4 lg:flex-row lg:items-center sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6 lg:space-y-0">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
            <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
              All Orders
            </CardTitle>
          </div>
          <div className="flex flex-col items-start w-full gap-3 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
            <Input
              className="w-48 h-8 p-2 text-sm"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-8 text-xs border-gray-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
          {/* Desktop Table */}
          <div className="hidden md:block -mx-4 overflow-x-auto sm:mx-0">
            <div className="min-w-[700px] px-4 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Payment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-6 text-sm text-center text-gray-400 sm:py-8"
                      >
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginated.map((order, index) => (
                      <TableRow key={order._id}>
                        <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                          {String(index + 1).padStart(3, "0")}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-gray-600 sm:py-4 sm:text-sm">
                          {formatDateTime(order.createdAt)}
                        </TableCell>
                        <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                          {order.customerName}
                        </TableCell>
                        <TableCell className="py-3 sm:py-4">
                          <OrderStatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                          {formatCurrency(order.total)}
                        </TableCell>
                        <TableCell className="py-3 sm:py-4 flex gap-2">
                          read
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage((p) => Math.max(1, p - 1));
                        }}
                        aria-disabled={page === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={page === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setPage((p) => Math.min(totalPages, p + 1));
                        }}
                        aria-disabled={page === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
          {/* Mobile Card/List */}
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <div className="py-6 text-sm text-center text-gray-400 sm:py-8">
                No orders found
              </div>
            ) : (
              paginated.map((order, index) => (
                <div
                  key={order._id}
                  className="rounded-lg border p-3 bg-white flex flex-col gap-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-900">
                      Order #{order.orderNumber || order._id}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <span>{formatDateTime(order.createdAt)}</span>
                    <span className="text-gray-400">|</span>
                    <span>{order.customerName}</span>
                    <span className="text-gray-400">|</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex gap-2 mt-2">read</div>
                </div>
              ))
            )}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      aria-disabled={page === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      aria-disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default OrdersTable;
