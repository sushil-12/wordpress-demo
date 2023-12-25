import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const users = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        username: "john_doe",
        email: "john@example.com",
        role: "Admin",
        permissions: ["create_user", "edit_user"],
      },
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        username: "john_doe",
        email: "john@example.com",
        role: "Editor",
        permissions: ["read_post", "write_post"],
      },
]
function formatString(inputString:string) {
    const words = inputString.split('_');
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(' ');
  }
  
export default function UsersList() {
    return (
        <div className="common-container">
            <div className="user-container">
                <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
                <Table>
                    <TableCaption>A list of your recent users.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Sr.no</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead className="text-center">Role</TableHead>
                            <TableHead className="text-center">Permissions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.id}</TableCell>
                                <TableCell>{user.firstName+ '' +user.lastName}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-center"><Badge variant="outline" className="text-right">{user.role}</Badge></TableCell>
                                <TableCell className="text-center">{user.permissions.map((item)=><Badge variant="outline" className="text-right">{item}</Badge>)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>User Count</TableCell>
                            <TableCell className="text-right">42</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>

    )
}
