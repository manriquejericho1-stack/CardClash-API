'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('answers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'game_sessions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cards',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      participant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'participants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'players',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      selected_choice: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      points_earned: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      hp_change: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      answered_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('answers');
  },
};