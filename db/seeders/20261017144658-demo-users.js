'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        school_id: '20990001',
        full_name: 'Demo Player One',
        email: 'player1@cardclash.test',
        role: 'PLAYER',
        created_at: new Date(),
      },
      {
        school_id: '20990002',
        full_name: 'Demo Player Two',
        email: 'player2@cardclash.test',
        role: 'PLAYER',
        created_at: new Date(),
      },
      {
        school_id: '20990003',
        full_name: 'Demo Player Three',
        email: 'player3@cardclash.test',
        role: 'PLAYER',
        created_at: new Date(),
      },
      {
        school_id: '20990004',
        full_name: 'Demo Player Four',
        email: 'player4@cardclash.test',
        role: 'PLAYER',
        created_at: new Date(),
      },
      {
        school_id: '20990005',
        full_name: 'Demo Host',
        email: 'host@cardclash.test',
        role: 'HOST',
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'player1@cardclash.test',
          'player2@cardclash.test',
          'player3@cardclash.test',
          'player4@cardclash.test',
          'host@cardclash.test',
        ],
      },
    });
  },
};