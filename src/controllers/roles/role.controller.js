const Role = require('../../models/roles/role.model');
const rolesController = {};
// Crear un nuevo rol
rolesController.createRole = async (req, res) => {
  const { name, permissions } = req.body;
  try {
    // Verificar si el rol ya existe
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ msg: 'El rol ya existe' });
    }
    // Crear nuevo rol
    const role = new Role({ name, permissions });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};
// Obtener todos los roles
rolesController.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate('permissions');
    res.status(200).json(roles);
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
};

// Obtener un rol por su id
rolesController.getRoleById = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findById(id).populate('permissions');
    if (!role) {
      return res.status(404).json({ msg: 'Rol no encontrado' });
    }
    res.status(200).json(role);
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Rol no encontrado' });
    }
    res.status(500).send('Hubo un error');
  }
};

// Actualizar un rol existente
rolesController.updateRole = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  try {
    let role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ msg: 'Rol no encontrado' });
    }
    // Verificar si se cambió el nombre y que no exista ya otro rol con el mismo nombre
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res
          .status(400)
          .json({ msg: 'El nombre del rol ya está en uso' });
      }
      role.name = name;
    }
    // Actualizar permisos
    if (permissions) {
      role.permissions = permissions;
    }
    await role.save();
    res.status(200).json(role);
  } catch (error) {
    console.log(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Rol no encontrado' });
    }
    res.status(500).send('Hubo un error');
  }
};

// Eliminar un rol existente
module.exports = rolesController;
