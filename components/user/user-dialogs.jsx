import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserForm from "@/components/user/user-form";

export function UserDialogs({
  isAddOpen,
  isEditOpen,
  editingUser,
  onAddClose,
  onEditClose,
  onAddUser,
  onEditUser,
}) {
  return (
    <>
      <Dialog open={isEditOpen} onOpenChange={onEditClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={onEditUser} initialData={editingUser} />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOpen} onOpenChange={onAddClose}>
        <DialogTrigger asChild>
          <span style={{ display: "none" }} />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={onAddUser} />
        </DialogContent>
      </Dialog>
    </>
  );
}
