'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SpotifyToken extends Model {}

  SpotifyToken.init({
    access_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
    expires_in: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'SpotifyToken',
    timestamps: true,
  });

  return SpotifyToken;
};
