export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      fullname: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {}
  );

  return User;
};
