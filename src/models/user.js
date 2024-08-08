module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      fullname: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      tableName: 'users',
      table_name: 'users',
    }
  );

  User.associate = function (models) {
    // associations go here
  };

  return User;
};
