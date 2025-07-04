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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatDateTime, formatCurrency } from "@/utils/formatters";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { ChevronDown, ChevronRight, Eye, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import OrderDetailModal from "./order-detail-modal";

const OrdersTable = ({ orders = [] }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openItems, setOpenItems] = useState(new Set());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const toggleItem = (orderId) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(orderId)) {
      newOpenItems.delete(orderId);
    } else {
      newOpenItems.add(orderId);
    }
    setOpenItems(newOpenItems);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Responsive: show table on md+ screens, collapsible cards on mobile
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
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

          {/* Mobile Collapsible Cards */}
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <div className="py-6 text-sm text-center text-gray-400 sm:py-8">
                No orders found
              </div>
            ) : (
              paginated.map((order, index) => (
                <Collapsible
                  key={order._id}
                  open={openItems.has(order._id)}
                  onOpenChange={() => toggleItem(order._id)}
                >
                  <div className="rounded-lg border bg-white shadow-sm">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center gap-2">
                            {openItems.has(order._id) ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-xs font-semibold text-gray-900">
                              #{String(index + 1).padStart(3, "0")}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 truncate">
                              {order.customerName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDateTime(order.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <OrderStatusBadge status={order.status} />
                          <span className="text-xs font-medium text-gray-900">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-3 pb-3 space-y-3 border-t bg-gray-50">
                        {/* Order Details */}
                        <div className="pt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Package className="h-3 w-3" />
                            <span className="font-medium">Order Items:</span>
                          </div>
                          <div className="space-y-1">
                            {order.items?.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex justify-between items-center text-xs bg-white p-2 rounded border"
                              >
                                <span className="text-gray-900">
                                  {item.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">
                                    x{item.quantity}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="text-gray-900">
                              {formatCurrency(order.subtotal || order.total)}
                            </span>
                          </div>
                          {order.tax && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax:</span>
                              <span className="text-gray-900">
                                {formatCurrency(order.tax)}
                              </span>
                            </div>
                          )}
                          {order.discount && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Discount:</span>
                              <span className="text-gray-900">
                                -{formatCurrency(order.discount)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium border-t pt-1">
                            <span className="text-gray-900">Total:</span>
                            <span className="text-gray-900">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex-1"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex-1"
                          >
                            Print Receipt
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))
            )}

            {/* Mobile Pagination */}
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

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default OrdersTable;
