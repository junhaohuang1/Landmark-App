module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define("Review", {
    location: {
      type: DataTypes.STRING
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  });

  // Review.associate = function(models) {
  //     // We're saying that a Post should belong to an Author
  //     // A Post can't be created without an Author due to the foreign key constraint
  //     Review.belongsTo(models.Author, {
  //         foreignKey: {
  //             allowNull: false
  //         }
  //     });
  // };

  return Review;
};
