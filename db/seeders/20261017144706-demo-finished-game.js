'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const db = queryInterface.sequelize;

    // Helper: find an existing record using a unique identifying field.
    // If it does not exist, insert it and return the new record.
    async function findOrInsert(table, column, value, row) {
      const [existing] = await db.query(
        `SELECT * FROM "${table}" WHERE "${column}" = :value LIMIT 1`,
        {
          replacements: { value },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existing) {
        return existing;
      }

      await queryInterface.bulkInsert(table, [row]);

      const [created] = await db.query(
        `SELECT * FROM "${table}" WHERE "${column}" = :value LIMIT 1`,
        {
          replacements: { value },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      return created;
    }

    /*
     * ============================================================
     * 1. FIND USERS CREATED BY demo-users
     * ============================================================
     */

    const [player1] = await db.query(
      `SELECT * FROM "users" WHERE "school_id" = :school_id`,
      {
        replacements: { school_id: '20990001' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const [player2] = await db.query(
      `SELECT * FROM "users" WHERE "school_id" = :school_id`,
      {
        replacements: { school_id: '20990002' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const [player3] = await db.query(
      `SELECT * FROM "users" WHERE "school_id" = :school_id`,
      {
        replacements: { school_id: '20990003' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const [player4] = await db.query(
      `SELECT * FROM "users" WHERE "school_id" = :school_id`,
      {
        replacements: { school_id: '20990004' },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!player1 || !player2 || !player3 || !player4) {
      throw new Error(
        'demo-users must be seeded before demo-finished-game.'
      );
    }

    /*
     * ============================================================
     * 2. QUESTION SET
     * ============================================================
     */

    const questionSet = await findOrInsert(
      'question_sets',
      'title',
      'Card Clash General Knowledge',
      {
        title: 'Card Clash General Knowledge',
        description: 'Demo question set for Card Clash.',
        subject: 'General Knowledge',
        grade_level: 'College',
      }
    );

    /*
     * ============================================================
     * 3. POWER CARD
     * ============================================================
     */

    const powerCard = await findOrInsert(
      'power_cards',
      'name',
      'Second Chance',
      {
        name: 'Second Chance',
        type: 'REVIVAL',
        description: 'Allows a participant to recover from elimination.',
        effect: 'Recover one failed participant through a revival challenge.',
      }
    );

    /*
     * ============================================================
     * 4. QUESTIONS
     * ============================================================
     */

    const questionData = [
      {
        text: 'What does CPU stand for?',
        type: 'MULTIPLE_CHOICE',
        time_limit_sec: 30,
        difficulty: 'EASY',
      },
      {
        text: 'Which data structure follows FIFO?',
        type: 'MULTIPLE_CHOICE',
        time_limit_sec: 30,
        difficulty: 'MEDIUM',
      },
      {
        text: 'What does API stand for?',
        type: 'MULTIPLE_CHOICE',
        time_limit_sec: 30,
        difficulty: 'EASY',
      },
    ];

    const questions = [];

    for (const data of questionData) {
      const question = await findOrInsert(
        'questions',
        'text',
        data.text,
        {
          question_set_id: questionSet.id,
          ...data,
        }
      );

      questions.push(question);
    }

    /*
     * ============================================================
     * 5. CHOICES
     * ============================================================
     */

    const choiceData = [
      {
        question_id: questions[0].id,
        choice_index: 1,
        choice_text: 'Central Processing Unit',
        is_correct: true,
      },
      {
        question_id: questions[0].id,
        choice_index: 2,
        choice_text: 'Computer Personal Unit',
        is_correct: false,
      },
      {
        question_id: questions[0].id,
        choice_index: 3,
        choice_text: 'Central Program Utility',
        is_correct: false,
      },

      {
        question_id: questions[1].id,
        choice_index: 1,
        choice_text: 'Stack',
        is_correct: false,
      },
      {
        question_id: questions[1].id,
        choice_index: 2,
        choice_text: 'Queue',
        is_correct: true,
      },
      {
        question_id: questions[1].id,
        choice_index: 3,
        choice_text: 'Tree',
        is_correct: false,
      },

      {
        question_id: questions[2].id,
        choice_index: 1,
        choice_text: 'Application Programming Interface',
        is_correct: true,
      },
      {
        question_id: questions[2].id,
        choice_index: 2,
        choice_text: 'Application Process Internet',
        is_correct: false,
      },
      {
        question_id: questions[2].id,
        choice_index: 3,
        choice_text: 'Advanced Programming Input',
        is_correct: false,
      },
    ];

    for (const choice of choiceData) {
      const [existing] = await db.query(
        `SELECT * FROM "choices"
         WHERE "question_id" = :question_id
         AND "choice_index" = :choice_index
         LIMIT 1`,
        {
          replacements: {
            question_id: choice.question_id,
            choice_index: choice.choice_index,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('choices', [choice]);
      }
    }

    /*
     * ============================================================
     * 6. QUESTION CARDS
     * ============================================================
     */

    const questionCards = [];

    for (const question of questions) {
      const [existing] = await db.query(
        `SELECT * FROM "question_cards"
         WHERE "question_id" = :question_id
         LIMIT 1`,
        {
          replacements: {
            question_id: question.id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existing) {
        questionCards.push(existing);
      } else {
        await queryInterface.bulkInsert('question_cards', [
          {
            question_id: question.id,
            difficulty: question.difficulty,
            team_points: 10,
            solo_points: 10,
          },
        ]);

        const [created] = await db.query(
          `SELECT * FROM "question_cards"
           WHERE "question_id" = :question_id
           LIMIT 1`,
          {
            replacements: {
              question_id: question.id,
            },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        questionCards.push(created);
      }
    }

    /*
     * ============================================================
     * 7. FINISHED GAME SESSION
     * ============================================================
     */

    const game = await findOrInsert(
      'game_sessions',
      'join_code',
      '418263',
      {
        join_code: '418263',
        question_set_id: questionSet.id,
        mode: 'SOLO',
        status: 'CLOSED',
        started_at: new Date('2026-10-17T09:00:00'),
        ended_at: new Date('2026-10-17T09:15:00'),
      }
    );

    /*
     * ============================================================
     * 8. SEATS
     * ============================================================
     */

    const seatUsers = [
      {
        user: player1,
        seat_number: 1,
      },
      {
        user: player2,
        seat_number: 2,
      },
      {
        user: player3,
        seat_number: 3,
      },
      {
        user: player4,
        seat_number: 4,
      },
    ];

    const seats = [];

    for (const item of seatUsers) {
      const [existing] = await db.query(
        `SELECT * FROM "seat"
         WHERE "game" = :game
         AND "user_id" = :user_id
         LIMIT 1`,
        {
          replacements: {
            game: game.id,
            user_id: item.user.user_id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existing) {
        seats.push(existing);
      } else {
        await queryInterface.bulkInsert('seat', [
          {
            game: game.id,
            user_id: item.user.user_id,
            seat_number: item.seat_number,
            joined_at: new Date('2026-10-17T09:00:00'),
          },
        ]);

        const [created] = await db.query(
          `SELECT * FROM "seat"
           WHERE "game" = :game
           AND "user_id" = :user_id
           LIMIT 1`,
          {
            replacements: {
              game: game.id,
              user_id: item.user.user_id,
            },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        seats.push(created);
      }
    }

    /*
     * ============================================================
     * 9. PLAYERS
     * ============================================================
     */

    const playerData = [
      {
        nickname: 'Demo Player One',
        token: 'demo-token-player-1',
        status: 'COMPLETED',
      },
      {
        nickname: 'Demo Player Two',
        token: 'demo-token-player-2',
        status: 'COMPLETED',
      },
      {
        nickname: 'Demo Player Three',
        token: 'demo-token-player-3',
        status: 'COMPLETED',
      },
      {
        nickname: 'Demo Player Four',
        token: 'demo-token-player-4',
        status: 'LEFT_EARLY',
      },
    ];

    const players = [];

    for (const data of playerData) {
      const [existing] = await db.query(
        `SELECT * FROM "players"
         WHERE "session_id" = :session_id
         AND "nickname" = :nickname
         LIMIT 1`,
        {
          replacements: {
            session_id: game.id,
            nickname: data.nickname,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existing) {
        players.push(existing);
      } else {
        await queryInterface.bulkInsert('players', [
          {
            session_id: game.id,
            ...data,
          },
        ]);

        const [created] = await db.query(
          `SELECT * FROM "players"
           WHERE "session_id" = :session_id
           AND "nickname" = :nickname
           LIMIT 1`,
          {
            replacements: {
              session_id: game.id,
              nickname: data.nickname,
            },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        players.push(created);
      }
    }

    /*
     * ============================================================
     * 10. PARTICIPANTS
     * ============================================================
     */

    const participantData = [
      {
        type: 'SOLO',
        name: 'Demo Player One',
        score: 30,
        hp: 100,
        revival_count: 0,
        status: 'ACTIVE',
      },
      {
        type: 'SOLO',
        name: 'Demo Player Two',
        score: 20,
        hp: 90,
        revival_count: 0,
        status: 'ACTIVE',
      },
      {
        type: 'SOLO',
        name: 'Demo Player Three',
        score: 20,
        hp: 80,
        revival_count: 1,
        status: 'ACTIVE',
      },
      {
        type: 'SOLO',
        name: 'Demo Player Four',
        score: 0,
        hp: 0,
        revival_count: 0,
        status: 'ELIMINATED',
      },
    ];

    const participants = [];

    for (const data of participantData) {
      const [existing] = await db.query(
        `SELECT * FROM "participants"
         WHERE "session_id" = :session_id
         AND "name" = :name
         LIMIT 1`,
        {
          replacements: {
            session_id: game.id,
            name: data.name,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existing) {
        participants.push(existing);
      } else {
        await queryInterface.bulkInsert('participants', [
          {
            session_id: game.id,
            ...data,
          },
        ]);

        const [created] = await db.query(
          `SELECT * FROM "participants"
           WHERE "session_id" = :session_id
           AND "name" = :name
           LIMIT 1`,
          {
            replacements: {
              session_id: game.id,
              name: data.name,
            },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        participants.push(created);
      }
    }

    /*
     * ============================================================
     * 11. PARTICIPANT MEMBERS
     * ============================================================
     */

    for (let i = 0; i < participants.length; i++) {
      const [existing] = await db.query(
        `SELECT * FROM "participant_members"
         WHERE "participant_id" = :participant_id
         AND "player_id" = :player_id
         LIMIT 1`,
        {
          replacements: {
            participant_id: participants[i].id,
            player_id: players[i].id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('participant_members', [
          {
            participant_id: participants[i].id,
            player_id: players[i].id,
          },
        ]);
      }
    }

    /*
     * ============================================================
     * 12. DECKS
     * ============================================================
     */

    const decks = [];

    for (const participant of participants) {
      const [existing] = await db.query(
        `SELECT * FROM "decks"
         WHERE "participant_id" = :participant_id
         LIMIT 1`,
        {
          replacements: {
            participant_id: participant.id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existing) {
        decks.push(existing);
      } else {
        await queryInterface.bulkInsert('decks', [
          {
            participant_id: participant.id,
            status: 'ACTIVE',
          },
        ]);

        const [created] = await db.query(
          `SELECT * FROM "decks"
           WHERE "participant_id" = :participant_id
           LIMIT 1`,
          {
            replacements: {
              participant_id: participant.id,
            },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        decks.push(created);
      }
    }

    /*
     * ============================================================
     * 13. CARDS
     * ============================================================
     */

    const cards = [];

    for (let i = 0; i < decks.length; i++) {
      const [existing] = await db.query(
        `SELECT * FROM "cards"
         WHERE "deck_id" = :deck_id
         LIMIT 1`,
        {
          replacements: {
            deck_id: decks[i].id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (existing) {
        cards.push(existing);
      } else {
        await queryInterface.bulkInsert('cards', [
          {
            deck_id: decks[i].id,
            color: ['RED', 'BLUE', 'GREEN', 'YELLOW'][i],
            card_type: 'QUESTION',
            position: 1,
            status: 'AVAILABLE',
            question_card_id: questionCards[i % questionCards.length].id,
            power_card_id: null,
          },
        ]);

        const [created] = await db.query(
          `SELECT * FROM "cards"
           WHERE "deck_id" = :deck_id
           LIMIT 1`,
          {
            replacements: {
              deck_id: decks[i].id,
            },
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        cards.push(created);
      }
    }

    /*
     * ============================================================
     * 14. PARTICIPANT POWER CARD
     * ============================================================
     */

    const [existingPowerCard] = await db.query(
      `SELECT * FROM "participant_power_cards"
       WHERE "participant_id" = :participant_id
       AND "power_card_id" = :power_card_id
       LIMIT 1`,
      {
        replacements: {
          participant_id: participants[2].id,
          power_card_id: powerCard.id,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingPowerCard) {
      await queryInterface.bulkInsert('participant_power_cards', [
        {
          participant_id: participants[2].id,
          power_card_id: powerCard.id,
          acquired_card_id: cards[2].id,
          status: 'USED',
          stored_at: new Date('2026-10-17T09:05:00'),
        },
      ]);
    }

    /*
     * ============================================================
     * 15. ANSWERS
     * ============================================================
     */

    const answerData = [
      {
        card_id: cards[0].id,
        participant_id: participants[0].id,
        player_id: players[0].id,
        selected_choice: 1,
        correct: true,
        points_earned: 10,
        hp_change: 0,
      },
      {
        card_id: cards[1].id,
        participant_id: participants[1].id,
        player_id: players[1].id,
        selected_choice: 2,
        correct: true,
        points_earned: 10,
        hp_change: 0,
      },
      {
        card_id: cards[2].id,
        participant_id: participants[2].id,
        player_id: players[2].id,
        selected_choice: 1,
        correct: true,
        points_earned: 10,
        hp_change: 0,
      },
      {
        card_id: cards[3].id,
        participant_id: participants[3].id,
        player_id: players[3].id,
        selected_choice: 2,
        correct: false,
        points_earned: 0,
        hp_change: -100,
      },
    ];

    for (const answer of answerData) {
      const [existing] = await db.query(
        `SELECT * FROM "answers"
         WHERE "session_id" = :session_id
         AND "card_id" = :card_id
         LIMIT 1`,
        {
          replacements: {
            session_id: game.id,
            card_id: answer.card_id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('answers', [
          {
            session_id: game.id,
            ...answer,
            answered_at: new Date('2026-10-17T09:10:00'),
          },
        ]);
      }
    }

    /*
     * ============================================================
     * 16. AID REQUEST
     * ============================================================
     */

    const [existingAid] = await db.query(
      `SELECT * FROM "aid_requests"
       WHERE "session_id" = :session_id
       LIMIT 1`,
      {
        replacements: {
          session_id: game.id,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let aidRequest;

    if (existingAid) {
      aidRequest = existingAid;
    } else {
      await queryInterface.bulkInsert('aid_requests', [
        {
          session_id: game.id,
          requester_id: participants[2].id,
          target_id: participants[0].id,
          status: 'ACCEPTED',
          expires_at: new Date('2026-10-17T09:12:00'),
        },
      ]);

      [aidRequest] = await db.query(
        `SELECT * FROM "aid_requests"
         WHERE "session_id" = :session_id
         LIMIT 1`,
        {
          replacements: {
            session_id: game.id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
    }

    /*
     * ============================================================
     * 17. REVIVAL
     * ============================================================
     */

    const [existingRevival] = await db.query(
      `SELECT * FROM "revivals"
       WHERE "aid_request_id" = :aid_request_id
       LIMIT 1`,
      {
        replacements: {
          aid_request_id: aidRequest.id,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let revival;

    if (existingRevival) {
      revival = existingRevival;
    } else {
      await queryInterface.bulkInsert('revivals', [
        {
          aid_request_id: aidRequest.id,
          aiding_participant_id: participants[0].id,
          outcome: 'SUCCESS',
          revival_cost: 5,
          points_before_revival: 25,
          points_retained: 20,
          points_transferred: 5,
          processed_at: new Date('2026-10-17T09:08:00'),
        },
      ]);

      [revival] = await db.query(
        `SELECT * FROM "revivals"
         WHERE "aid_request_id" = :aid_request_id
         LIMIT 1`,
        {
          replacements: {
            aid_request_id: aidRequest.id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
    }

    /*
     * ============================================================
     * 18. COMEBACK CHALLENGE
     * ============================================================
     */

    const [existingChallenge] = await db.query(
      `SELECT * FROM "comeback_challenges"
       WHERE "revival_id" = :revival_id
       LIMIT 1`,
      {
        replacements: {
          revival_id: revival.id,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let challenge;

    if (existingChallenge) {
      challenge = existingChallenge;
    } else {
      await queryInterface.bulkInsert('comeback_challenges', [
        {
          revival_id: revival.id,
          participant_id: participants[2].id,
          time_limit_sec: 30,
          points_lost: 5,
          points_recovered: 5,
          status: 'COMPLETED',
          started_at: new Date('2026-10-17T09:08:30'),
          ended_at: new Date('2026-10-17T09:09:00'),
        },
      ]);

      [challenge] = await db.query(
        `SELECT * FROM "comeback_challenges"
         WHERE "revival_id" = :revival_id
         LIMIT 1`,
        {
          replacements: {
            revival_id: revival.id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
    }

    /*
     * ============================================================
     * 19. COMEBACK CARD
     * ============================================================
     */

    const [existingComebackCard] = await db.query(
      `SELECT * FROM "comeback_cards"
       WHERE "challenge_id" = :challenge_id
       LIMIT 1`,
      {
        replacements: {
          challenge_id: challenge.id,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!existingComebackCard) {
      await queryInterface.bulkInsert('comeback_cards', [
        {
          challenge_id: challenge.id,
          question_id: questions[2].id,
          fixed_points: 5,
          status: 'USED',
        },
      ]);
    }

    /*
     * ============================================================
     * 20. GAME RESULTS
     * ============================================================
     */

    const resultData = [
      {
        participant_id: participants[0].id,
        final_score: 30,
        final_hp: 100,
        correct_answers: 1,
        wrong_answers: 0,
        power_cards_used: 0,
        revivals_used: 0,
        comeback_points: 0,
        final_status: 'COMPLETED',
      },
      {
        participant_id: participants[1].id,
        final_score: 20,
        final_hp: 90,
        correct_answers: 1,
        wrong_answers: 0,
        power_cards_used: 0,
        revivals_used: 0,
        comeback_points: 0,
        final_status: 'COMPLETED',
      },
      {
        participant_id: participants[2].id,
        final_score: 20,
        final_hp: 80,
        correct_answers: 1,
        wrong_answers: 0,
        power_cards_used: 1,
        revivals_used: 1,
        comeback_points: 5,
        final_status: 'COMPLETED',
      },
      {
        participant_id: participants[3].id,
        final_score: 0,
        final_hp: 0,
        correct_answers: 0,
        wrong_answers: 1,
        power_cards_used: 0,
        revivals_used: 0,
        comeback_points: 0,
        final_status: 'INCOMPLETE',
      },
    ];

    for (const result of resultData) {
      const [existing] = await db.query(
        `SELECT * FROM "game_results"
         WHERE "session_id" = :session_id
         AND "participant_id" = :participant_id
         LIMIT 1`,
        {
          replacements: {
            session_id: game.id,
            participant_id: result.participant_id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('game_results', [
          {
            session_id: game.id,
            ...result,
          },
        ]);
      }
    }

    console.log('Card Clash demo finished game seeded successfully.');
  },

  async down(queryInterface, Sequelize) {
    const db = queryInterface.sequelize;

    const [game] = await db.query(
      `SELECT id FROM "game_sessions"
       WHERE "join_code" = '418263'
       LIMIT 1`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!game) {
      return;
    }

    // Delete children first because of foreign-key relationships.
    await queryInterface.bulkDelete('game_results', {
      session_id: game.id,
    });

    await queryInterface.bulkDelete('answers', {
      session_id: game.id,
    });

    await queryInterface.bulkDelete('aid_requests', {
      session_id: game.id,
    });

    await queryInterface.bulkDelete('seat', {
      game: game.id,
    });

    await queryInterface.bulkDelete('participant_members', {
      participant_id: {
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT id FROM participants WHERE session_id = ${game.id})`
        ),
      },
    });

    await queryInterface.bulkDelete('participant_power_cards', {
      participant_id: {
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT id FROM participants WHERE session_id = ${game.id})`
        ),
      },
    });

    await queryInterface.bulkDelete('cards', {
      deck_id: {
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT id FROM decks WHERE participant_id IN
            (SELECT id FROM participants WHERE session_id = ${game.id}))`
        ),
      },
    });

    await queryInterface.bulkDelete('decks', {
      participant_id: {
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT id FROM participants WHERE session_id = ${game.id})`
        ),
      },
    });

    await queryInterface.bulkDelete('comeback_cards', {
      challenge_id: {
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT id FROM comeback_challenges
            WHERE revival_id IN
            (SELECT id FROM revivals
             WHERE aid_request_id IN
             (SELECT id FROM aid_requests
              WHERE session_id = ${game.id})))`
        ),
      },
    });

    await queryInterface.bulkDelete('comeback_challenges', {
      revival_id: {
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT id FROM revivals
            WHERE aid_request_id IN
            (SELECT id FROM aid_requests
             WHERE session_id = ${game.id}))`
        ),
      },
    });

    await queryInterface.bulkDelete('revivals', {
      aid_request_id: {
        [Sequelize.Op.in]: Sequelize.literal(
          `(SELECT id FROM aid_requests
            WHERE session_id = ${game.id})`
        ),
      },
    });

    await queryInterface.bulkDelete('players', {
      session_id: game.id,
    });

    await queryInterface.bulkDelete('participants', {
      session_id: game.id,
    });

    await queryInterface.bulkDelete('game_sessions', {
      id: game.id,
    });
  },
};