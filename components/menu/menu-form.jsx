"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { menuSchema, menuEditSchema } from "@/lib/schemas";
import { useCategory } from "@/hooks/use-category";
import { Switch } from "@/components/ui/switch";
import { validatePrice, validateRequired } from "@/utils/validation";
import { VALIDATION_LIMITS } from "@/utils/constants";

const MenuForm = ({ onSubmit, initialData = null, loading = false }) => {
  const isEditing = !!initialData;
  const { categories } = useCategory();

  const form = useForm({
    resolver: zodResolver(isEditing ? menuEditSchema : menuSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      category: initialData?.category?._id || initialData?.category || "main",
      image: initialData?.image || "",
      available: initialData?.available !== false,
    },
  });

  const handleSubmit = (data) => {
    // Additional validation using utility functions
    if (!validateRequired(data.name)) {
      form.setError("name", { message: "Name is required" });
      return;
    }

    if (!validatePrice(data.price)) {
      form.setError("price", { message: "Price must be greater than 0" });
      return;
    }

    if (
      data.description &&
      data.description.length > VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH
    ) {
      form.setError("description", {
        message: `Description must be less than ${VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH} characters`,
      });
      return;
    }

    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter item name"
                  {...field}
                  maxLength={VALIDATION_LIMITS.NAME_MAX_LENGTH}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter item description"
                  {...field}
                  maxLength={VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Enter price"
                  min={VALIDATION_LIMITS.PRICE_MIN}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="Enter image URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Available</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Make this item available for ordering
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label={field.value ? "Set unavailable" : "Set available"}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading || form.formState.isSubmitting}
            className="flex-1"
          >
            {loading || form.formState.isSubmitting
              ? isEditing
                ? "Updating..."
                : "Adding..."
              : (isEditing ? "Update" : "Add") + " Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MenuForm;
