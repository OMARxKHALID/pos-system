"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { VALIDATION_LIMITS, USER_ROLES } from "@/utils/constants";

const UserForm = ({ onSubmit, initialData = null, loading = false }) => {
  const isEditing = !!initialData;

  const form = useForm({
    resolver: zodResolver(isEditing ? userEditSchema : userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      role: initialData?.role || USER_ROLES.STAFF,
    },
  });

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
                  maxLength={VALIDATION_LIMITS.NAME_MAX_LENGTH}
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
                  maxLength={VALIDATION_LIMITS.PASSWORD_MAX_LENGTH}
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
                  <SelectItem value={USER_ROLES.STAFF}>Staff</SelectItem>
                  <SelectItem value={USER_ROLES.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
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
