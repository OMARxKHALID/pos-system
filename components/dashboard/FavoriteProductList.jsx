import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import ProductRow from "./ProductRow";

const FavoriteProductList = ({ products, search, setSearch }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-base font-semibold">
        Favorite Product
      </CardTitle>
      <div className="flex items-center gap-2">
        <Input
          className="w-32 h-8 p-2 text-sm"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="w-4 h-4 text-gray-400" />
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Img</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead className="text-right">Total Orders</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.slice(0, 5).map((product) => (
            <ProductRow key={product.name} product={product} />
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="py-8 text-center text-gray-400">
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default FavoriteProductList;
