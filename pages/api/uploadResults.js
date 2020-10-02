import xlsx from "xlsx";
import { IncomingForm } from "formidable";
import fetch from "node-fetch";
import { parseDataForTeam } from "./helpers";

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

async function emailTeamScorecard(dataForTeam, modelAnswers, date) {
  const response = await fetch(`${BASE_URL}/api/emailTeamScorecard`, {
    method: "POST",
    body: JSON.stringify({
      dataForTeam,
      modelAnswers,
      date,
    }),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

export default async function uploadResults(req, res) {
  try {
    // parse incoming form
    const { filePath, date } = await new Promise((resolve, reject) => {
      const form = new IncomingForm();

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ filePath: files.results.path, date: fields.date });
      });
    });

    const workbook = xlsx.readFile(filePath);
    const [modelRow, ...teams] = xlsx.utils.sheet_to_json(
      workbook.Sheets["Raw Data"]
    );
    const { answers: modelAnswers } = parseDataForTeam(modelRow);
    await Promise.all(
      teams
        .filter(({ "Row Labels": rowLabels }) => !!rowLabels)
        .map((dataForTeam) =>
          emailTeamScorecard(dataForTeam, modelAnswers, date)
        )
    );
    res.send("Success");
  } catch (e) {
    console.log(e);
    res.status(502).send(e.message);
  }
}
