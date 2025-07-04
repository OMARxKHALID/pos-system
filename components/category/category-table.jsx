"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const CategoryTable = ({ categories = [], onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-sm sm:rounded-xl">
      <CardHeader className="flex flex-col items-start justify-between px-4 pt-4 pb-3 space-y-4 lg:flex-row lg:items-center sm:pb-4 sm:px-5 lg:px-6 sm:pt-5 lg:pt-6 lg:space-y-0">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
          <CardTitle className="text-base font-semibold text-gray-900 sm:text-lg">
            All Categories
          </CardTitle>
        </div>
        <div className="flex flex-col items-start w-full gap-3 sm:flex-row sm:items-center sm:gap-6 lg:w-auto">
          <Input
            className="w-48 h-8 p-2 text-sm"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-4 sm:px-5 lg:px-6 sm:pb-5 lg:pb-6">
        {/* Desktop Table */}
        <div className="hidden md:block -mx-4 overflow-x-auto sm:mx-0">
          <div className="min-w-[600px] px-4 sm:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-6 text-sm text-center text-gray-400 sm:py-8"
                    >
                      No categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat._id}>
                      <TableCell className="py-3 text-xs font-medium text-gray-900 sm:py-4 sm:text-sm">
                        {cat.name}
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        {cat.icon ? (
                          <span className="text-xl">{cat.icon}</span>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3 sm:py-4">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-3 sm:py-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(cat)}
                          className="text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(cat._id)}
                          className="text-xs"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Mobile Card/List */}
        <div className="md:hidden space-y-3">
          {filteredCategories.length === 0 ? (
            <div className="py-6 text-sm text-center text-gray-400 sm:py-8">
              No categories found
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="rounded-lg border p-3 bg-white flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-900">
                    {cat.name}
                  </span>
                  {cat.icon ? (
                    <span className="text-xl">{cat.icon}</span>
                  ) : (
                    <Badge variant="secondary">None</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <Badge variant="secondary">No image</Badge>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(cat)}
                    className="text-xs flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(cat._id)}
                    className="text-xs flex-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryTable;
