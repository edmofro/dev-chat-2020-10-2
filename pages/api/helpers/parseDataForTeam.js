function extractRoundAndQuestion(key) {
  return key.match(/\d+/g).map(parseFloat);
}

function parseAnswers(data) {
  const answers = [];
  Object.entries(data)
    .filter(([key]) => key.startsWith("Resp"))
    .forEach(([key, answer]) => {
      const [round, question] = extractRoundAndQuestion(key);
      if (!answers[round]) answers[round] = [];
      answers[round][question] = answer;
    });
  return answers;
}

function parseScores(data) {
  const scores = [];
  Object.entries(data)
    .filter(([key]) => key.startsWith("Score"))
    .forEach(([key, score]) => {
      const [round, question] = extractRoundAndQuestion(key);
      if (!scores[round]) scores[round] = [];
      scores[round][question] = parseFloat(score);
    });
  return scores;
}

export function parseDataForTeam(dataForTeam) {
  const {
    "Row Labels": teamName,
    "Email Address": emailAddress,
    "Total Score": totalScore,
    "Bonus Round": bonusScore,
  } = dataForTeam;
  const answers = parseAnswers(dataForTeam);
  const scores = parseScores(dataForTeam);
  return {
    teamName,
    emailAddress,
    answers,
    scores,
    bonusScore,
    totalScore,
  };
}
