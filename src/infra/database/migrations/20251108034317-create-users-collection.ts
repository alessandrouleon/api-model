module.exports = {
    async up(db, client) {
        // Cria a coleção users com validação
        await db.createCollection('users', {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['name'],
                    properties: {
                        name: {
                            bsonType: 'string',
                            description: 'Nome é obrigatório'
                        },
                        username: {
                            bsonType: 'string',
                            description: 'Username único',
                            uniqueItems: true
                        },
                        email: {
                            bsonType: 'string',
                            description: 'Email do usuário',
                            uniqueItems: true
                        },
                        password: {
                            bsonType: 'string',
                            description: 'Senha criptografada'
                        },
                        role: {
                            bsonType: 'string',
                            enum: ['ADMIN', 'USER'],
                            description: 'Papel do usuário'
                        },
                        createdAt: {
                            bsonType: 'date'
                        },
                        updatedAt: {
                            bsonType: 'date'
                        },
                        deletedAt: {
                            bsonType: ['date', 'null']
                        }
                    }
                }
            }
        });

        // Cria índices
        await db.collection('users').createIndex({ username: 1 }, { unique: true, sparse: true });
        await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
        await db.collection('users').createIndex({ createdAt: -1 });
    },

    async down(db, client) {
        // Remove a coleção
        await db.collection('users').drop();
    }
};