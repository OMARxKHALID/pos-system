import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, formatCurrency } from "@/utils/formatters";
import { Package, User, CreditCard, Calendar, Hash } from "lucide-react";

export function OrderDetailContent({ order }) {
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-5 w-5 text-gray-500 flex-shrink-0" />;
      case "cash":
        return <Package className="h-5 w-5 text-gray-500 flex-shrink-0" />;
      case "wallet":
        return <CreditCard className="h-5 w-5 text-gray-500 flex-shrink-0" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500 flex-shrink-0" />;
    }
  };

  return (
    <>
      {/* Order Information */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Order Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  Date & Time
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {formatDateTime(order.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  Customer
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {order.customerName}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Hash className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  Order Number
                </div>
                <div className="text-sm text-gray-600 font-mono">
                  {order.orderNumber}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {getPaymentMethodIcon(order.paymentMethod)}
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900">
                  Payment Method
                </div>
                <div className="text-sm text-gray-600 capitalize">
                  {order.paymentMethod}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">Status:</div>
            <OrderStatusBadge status={order.status} />
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Order Items ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm sm:text-base">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Quantity: {item.quantity}
                  </div>
                  {item.discount > 0 && (
                    <div className="text-sm text-green-600 mt-1">
                      Discount: {formatCurrency(item.discount)}
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <div className="font-medium text-gray-900 text-sm sm:text-base">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                  <div className="text-sm text-gray-600">
                    @ {formatCurrency(item.price)} each
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(order.subtotal)}
              </span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(order.tax)}
                </span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-green-600">
                  -{formatCurrency(order.discount)}
                </span>
              </div>
            )}
            <Separator className="my-3" />
            <div className="flex justify-between items-center py-2">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
