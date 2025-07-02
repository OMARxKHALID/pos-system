import { TableRow, TableCell } from "@/components/ui/table";

const ProductRow = ({ product }) => (
  <TableRow>
    <TableCell>
      <div className="flex items-center justify-center w-10 h-10 text-lg font-bold bg-gray-100 rounded-lg">
        {product.name.charAt(0)}
      </div>
    </TableCell>
    <TableCell>
      <div className="text-sm font-medium text-gray-900">{product.name}</div>
      <div className="text-xs text-gray-400">
        {product.category || "Product"}
      </div>
    </TableCell>
    <TableCell className="text-sm font-semibold text-right text-gray-700">
      {product.quantity}x
    </TableCell>
  </TableRow>
);

export default ProductRow;
