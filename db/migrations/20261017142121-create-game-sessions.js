'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_sessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      join_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },

      question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      mode: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },

      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('game_sessions', {
      type: 'unique',
      name: 'uq_game_sessions_join_code',
      fields: ['join_code'],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'game_sessions',
      'uq_game_sessions_join_code'
    );

    await queryInterface.dropTable('game_sessions');
  },
};