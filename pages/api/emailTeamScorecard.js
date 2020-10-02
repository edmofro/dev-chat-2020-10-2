import { parseDataForTeam, buildScorecardPdf, emailScorecard } from "./helpers";

export default async function emailTeamScorecard(req, res) {
  try {
    const { dataForTeam, modelAnswers, date } = JSON.parse(req.body);
    const { emailAddress, teamName, ...dataForScorecard } = parseDataForTeam(
      dataForTeam
    );
    const filePath = buildScorecardPdf(
      { teamName, ...dataForScorecard },
      modelAnswers,
      date
    );
    await emailScorecard({ emailAddress, filePath, teamName, date });
    res.send(`Processed team ${teamName}`);
  } catch (error) {
    res
      .status(502)
      .send(`Something went wrong with processing a team: ${error.message}`);
  }
}
