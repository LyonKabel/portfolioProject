'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotifyToken extends Model {
    static associate(models) {
      
    }
  }

  SpotifyToken.init({
    access_token: DataTypes.STRING,
    token_type: DataTypes.STRING,
    expires_in: DataTypes.BIGINT,
    refresh_token: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SpotifyToken',
  });

  return SpotifyToken;
};
