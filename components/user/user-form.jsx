"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { userSchema, userEditSchema } from "@/lib/schemas";
import {
  validateEmail,
  validateName,
  validateRequired,
} from "@/utils/validation";
import {
  getDefaultPermissions,
  getAvailablePermissions,
} from "@/utils/permission-utils";
import React from "react";

const UserForm = ({ onSubmit, initialData = null, loading = false }) => {
  const isEditing = !!initialData;

  // Get available permissions from centralized utility
  const availablePermissions = getAvailablePermissions();

  const form = useForm({
    resolver: zodResolver(isEditing ? userEditSchema : userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || "staff",
      permissions: initialData?.permissions || [
        "dashboard",
        "menu",
        "category",
        "orders",
      ],
    },
  });

  // Watch for role changes and update permissions accordingly
  const watchedRole = form.watch("role");
  const watchedPermissions = form.watch("permissions");

  // Update permissions when role changes
  React.useEffect(() => {
    if (watchedRole) {
      const defaultPermissions = getDefaultPermissions(watchedRole);
      form.setValue("permissions", defaultPermissions);
    }
  }, [watchedRole, form]);

  const handleSubmit = (data) => {
    // Additional validation using utility functions
    if (!validateRequired(data.name)) {
      form.setError("name", { message: "Name is required" });
      return;
    }

    if (!validateName(data.name)) {
      form.setError("name", {
        message: "Name can only contain letters and spaces",
      });
      return;
    }

    if (!validateEmail(data.email)) {
      form.setError("email", { message: "Please enter a valid email address" });
      return;
    }

    if (!isEditing && !validateRequired(data.password)) {
      form.setError("password", { message: "Password is required" });
      return;
    }

    // Ensure at least one permission is selected
    if (!data.permissions || data.permissions.length === 0) {
      form.setError("permissions", {
        message: "At least one permission must be selected",
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
                  placeholder="Enter full name"
                  {...field}
                  maxLength={50}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password {isEditing && "(leave blank to keep current)"}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...field}
                  maxLength={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <div className="space-y-3">
                {availablePermissions.map((permission) => (
                  <div
                    key={permission.value}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={permission.value}
                      checked={field.value?.includes(permission.value) || false}
                      onCheckedChange={(checked) => {
                        const currentPermissions = field.value || [];
                        if (checked) {
                          field.onChange([
                            ...currentPermissions,
                            permission.value,
                          ]);
                        } else {
                          field.onChange(
                            currentPermissions.filter(
                              (p) => p !== permission.value
                            )
                          );
                        }
                      }}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={permission.value}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {permission.label}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
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
              : (isEditing ? "Update" : "Add") + " User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
