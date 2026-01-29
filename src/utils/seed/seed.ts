import mongoose from 'mongoose';

// Importa o schema do usuário
import { UserSchema } from '@/modules/users/models/user.model';

async function main() {
  await mongoose.connect('mongodb://localhost:27017/service-order');

  const UserModel = mongoose.model('User', UserSchema);

  const users = [
    {
      _id: new mongoose.Types.ObjectId('69232af427edc653fb85f6e9'),
      name: 'Administrador',
      username: 'admin',
      password: '$2b$10$NXezaTMyR/YLz.dTT3Eo8.8sFqY8er4sGQJ/FDIhyjMiEq4WeyjQi',
      email: 'admin@gmail.com',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
  ];

  await UserModel.deleteMany({}); // opcional
  await UserModel.insertMany(users);

  console.log('Seed executado com sucesso!');
  mongoose.disconnect();
}

main();
