const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT
      gs.join_code AS session_code,
      gs.started_at,
      gs.ended_at,
      u.school_id,
      p.nickname,
      gr.final_score AS score,
      (gr.final_status = 'COMPLETED') AS completed
    FROM game_sessions gs

    JOIN players p
      ON p.session_id = gs.id

    JOIN users u
      ON u.user_id = p.user_id

    JOIN participant_members pm
      ON pm.player_id = p.id

    JOIN participants part
      ON part.id = pm.participant_id
      AND part.session_id = gs.id

    JOIN game_results gr
      ON gr.participant_id = part.id
      AND gr.session_id = gs.id

    WHERE gs.status = 'CLOSED'

      AND (
        CAST(:since AS timestamptz) IS NULL
        OR gs.ended_at > CAST(:since AS timestamptz)
      )

    ORDER BY
      gs.ended_at,
      gr.final_score DESC;
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: {
      since: since ? since.toISOString() : null,
    },
  });
}

module.exports = {
  findFinishedGamePlayers,
};