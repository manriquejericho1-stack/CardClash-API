'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('choices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      choice_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      choice_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('choices');
  },
};