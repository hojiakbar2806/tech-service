import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useApi from "@/hooks/useApi";
import type { User } from "@/types/user";
import {
  Table, TableCell, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fetchUsers = async (api: ReturnType<typeof useApi>) => {
  const res = await api.get("users");
  return res.data as User[];
};

const UsersTable = () => {
  const api = useApi();
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(api),
  });

  const filteredUsers = selectedRole === "all"
    ? users
    : users.filter(user => user.role === selectedRole);

  const displayValue = (value: string | null | undefined) => {
    return value ? <span>{value}</span> : <span className="text-gray-400">To'ldirilmagan</span>;
  };

  const displayDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return <span className="text-black font-semibold">To'ldirilmagan</span>;
    const date = new Date(dateStr);
    return <span>{date.toLocaleString()}</span>;
  };

  const roles = ["all", "user", "master", "manager"];

  return (
    <div className="w-full max-w-full p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Foydalanuvchilar</h2>
        <Select
          value={selectedRole}
          onValueChange={setSelectedRole}
        >
          <SelectTrigger>
            <SelectValue placeholder="Role bo'yicha filtr" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role} value={role}>
                {role === "all" ? "Hammasi" : role.charAt(0).toUpperCase() + role.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <Table className="min-w-[600px]">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ism</TableCell>
              <TableCell>Familiya</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
            </TableRow>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))}
          </Table>
        ) : isError ? (
          <div className="text-center text-red-500">Ma'lumotlarni yuklashda xatolik yuz berdi.</div>
        ) : (
          <Table className="min-w-[600px]">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Ism</TableCell>
              <TableCell>Familiya</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
            </TableRow>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Foydalanuvchilar topilmadi
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id ?? <span className="text-black font-semibold">To'ldirilmagan</span>}</TableCell>
                  <TableCell>{displayValue(user.first_name)}</TableCell>
                  <TableCell>{displayValue(user.last_name)}</TableCell>
                  <TableCell>{displayValue(user.email)}</TableCell>
                  <TableCell>{displayValue(user.role)}</TableCell>
                  <TableCell>{displayDate(user.created_at)}</TableCell>
                  <TableCell>{displayDate(user.updated_at)}</TableCell>
                </TableRow>
              ))
            )}
          </Table>
        )}
      </div>
    </div >
  );
};

export default UsersTable;
