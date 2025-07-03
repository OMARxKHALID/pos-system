import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const FavoriteProducts = ({ products = [], search, setSearch }) => (
  <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
    <CardHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-3 sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6">
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
        <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
          Top Products
        </CardTitle>
      </div>
      <div className="flex items-center gap-2">
        <Input
          className="w-48 h-8 p-2 text-sm"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </CardHeader>
    <CardContent className="px-4 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Img</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Total Sold</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-6 text-center text-gray-400 text-sm"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-orange-100 rounded-lg sm:w-12 sm:h-12">
                      {product.icon ? (
                        <span className="text-xl sm:text-2xl">
                          {product.icon}
                        </span>
                      ) : product.image ? (
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-xs font-medium text-orange-600 sm:text-sm">
                          {product.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1 truncate leading-tight">
                      {product.name}
                    </div>
                    <div className="text-xs leading-tight text-gray-500">
                      {product.category}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-sm font-semibold leading-tight text-gray-900 sm:text-base">
                      {product.quantity}
                    </div>
                    <div className="text-xs leading-tight text-gray-500">
                      Sold
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* Mobile card/list view */}
      <div className="md:hidden space-y-2">
        {products.length === 0 ? (
          <div className="py-6 text-center text-gray-400 text-sm">
            No products found
          </div>
        ) : (
          products.map((product, index) => (
            <div
              key={index}
              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden bg-orange-100 rounded-lg">
                {product.icon ? (
                  <span className="text-xl">{product.icon}</span>
                ) : product.image ? (
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-xs font-medium text-orange-600">
                    {product.name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm mb-0.5 truncate leading-tight">
                  {product.name}
                </div>
                <div className="text-xs leading-tight text-gray-500">
                  {product.category}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-semibold leading-tight text-gray-900">
                  {product.quantity}
                </div>
                <div className="text-xs leading-tight text-gray-500">Sold</div>
              </div>
            </div>
          ))
        )}
      </div>
    </CardContent>
  </Card>
);

export default FavoriteProducts;
