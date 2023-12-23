// Creating predefined permissions
export const createPermissions = async () => {
    const permissions = ['read', 'write', 'delete'];
    const permissionObjects = permissions.map((name) => new Permission({ name }));
    await Permission.insertMany(permissionObjects);
};

// Creating predefined roles with associated permissions
export const createRoles = async () => {
    const adminRole = new Role({
        name: 'admin',
        permissions: await Permission.find(),
    });

    const userRole = new Role({
        name: 'user',
        permissions: await Permission.find({ name: 'read' }),
    });

    await adminRole.save();
    await userRole.save();
};
