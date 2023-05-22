const Role = require('../../models/role/role.model');
const roleController = {};
roleController.createRole = async (req, res) => {
  try {
    const { name, isActive, permissions } = req.body;

    const role = await Role.create({
      name,
      isActive,
      permissions,
    });

    const roleWithPermissions = await Role.findById(role._id).populate({
      path: 'permissions',
      select: '_id alias',
    });

    return res
      .status(201)
      .json({ message: 'Rol creado con éxito', role: roleWithPermissions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear rol' });
  }
};

roleController.getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
};

roleController.getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};
roleController.updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    const role = await Role.findById(id);

    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: 'Role not found' });
    }

    // Eliminar permisos existentes que no están en el arreglo enviado
    role.permissions = role.permissions.filter((permission) =>
      permissions.includes(permission)
    );

    // Agregar nuevos permisos al arreglo
    permissions.forEach((permission) => {
      if (!role.permissions.includes(permission)) {
        role.permissions.push(permission);
      } else {
        return res
          .status(400)
          .json({
            success: false,
            message: 'Permission already exists in this role',
          });
      }
    });

    await role.save();

    res.status(200).json({ success: true, data: role });
  } catch (error) {
    next(error);
  }
};

module.exports = roleController;
