import { UserRow } from "@/components/ui/users/UserRow";
import { RolesDto } from "@/lib/dto/RolesDto";
import { UserDataDto } from "@/lib/dto/UserDto";


interface UserTableProps {
  users: UserDataDto[]
  roles: RolesDto[]
  fetchUsers: () => void
}

export const UserTable: React.FC<UserTableProps> = ({ users, roles, fetchUsers}) => {
  return (
    <main>
        <table className="min-w-[800px] rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Nombre de usuario</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Roles</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onUserUpdated={fetchUsers}
                roles={roles}
              />
            ))}
          </tbody>
        </table>
  </main>
  )
}