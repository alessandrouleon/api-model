import { ROLES } from "@/modules/auth/enums/roles.enum";
import { UserEntity, UserIterfaces } from "./user.entity";


describe("UserEntity", () => {
  const validProps: UserIterfaces = {
    id: "1",
    name: "Joao DoeA",
    username: "joaoname",
    email: "joao@example.com",
    password: "Admin@123",
    isActive: true,
    roles: [ROLES.ADMIN],
  };



  it("should create a user with valid props", () => {
    const user = new UserEntity(validProps);

    expect(user.id).toBe("1");
    expect(user.name).toBe(validProps.name);
    expect(user.username).toBe(validProps.username);
    expect(user.email).toBe(validProps.email);
    expect(user.password).toBe(validProps.password);
    expect(user.roles).toBe(validProps.roles);
    expect(user.isActive).toBe(true);
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  /**
   * Verifica se o setter `name` funciona corretamente ao alterar o nome do usuário.
   */
  it("should update the name with setter", () => {
    const user = new UserEntity(validProps);
    user.name = "Jane Doe"; // usa o setter
    expect(user.name).toBe("Jane Doe");
  });

  /**
   * Espera que, ao tentar definir o nome como vazio,
   * a entidade lance um `DomainError`, pois o campo é obrigatório.
   */
  it("should throw error when setting empty name", () => {
    const user = new UserEntity(validProps);
    expect(() => (user.name = "")).toThrow("user: Name cannot be empty");
  });

  /**
   * ✅ Caso de teste 4: Atualização de outros campos
   *
   * Testa se os setters de `username`, `email`, `password` e `role`
   * funcionam corretamente quando recebem valores válidos.
   */
  it("should update username, email, password, role with setters", () => {
    const user = new UserEntity(validProps);

    user.username = "janedoe";
    user.email = "jane@example.com";
    user.password = "Admin@123";
    user.roles = [ROLES.USER];
    user.isActive = false;

    expect(user.username).toBe("janedoe");
    expect(user.email).toBe("jane@example.com");
    expect(user.password).toBe("Admin@123");
    expect(user.roles).toEqual([ROLES.USER]);
    expect(user.isActive).toBe(false);
  });

  /**
   * Garante que todos os campos sensíveis (`username`, `email`, `password`, `role`)
   * não possam ser definidos como vazios. Cada setter deve lançar um `DomainError`.
   */
  it("should throw error when setting empty values for other fields", () => {
    const user = new UserEntity(validProps);

    expect(() => (user.username = "")).toThrow("user: Username cannot be empty");
    expect(() => (user.email = "")).toThrow("user: Email cannot be empty");
    expect(() => (user.password = "")).toThrow("user: Password cannot be empty");
    expect(() => (user.roles = [])).toThrow("user: Roles are required");
  });

  /**
   * Testa se o método `toJSON()` retorna a representação pública do usuário,
   * sem incluir o campo `password` (por segurança).
   */
  it("should return correct JSON representation", () => {
    const user = new UserEntity(validProps);
    const json = user.toJSON();

    expect(json).toEqual({
      id: "1",
      name: validProps.name,
      username: validProps.username,
      email: validProps.email,
      roles: validProps.roles,
      isActive: true,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});

