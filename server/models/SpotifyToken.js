'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotifyToken extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  SpotifyToken.init({
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token_type: {
      type: DataTypes.STRING,
    },
    expires_in: {
      type: DataTypes.BIGINT,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'SpotifyToken',
  });

  return SpotifyToken;
};
