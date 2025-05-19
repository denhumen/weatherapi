module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Subscription', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false
      },
      frequency: {
        type: DataTypes.ENUM('hourly','daily'),
        allowNull: false
      },
      token: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
  };  