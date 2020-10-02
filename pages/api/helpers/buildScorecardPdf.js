import PdfPrinter from "pdfmake";
import fs from "fs";
import path from "path";

// use /tmp on lambda as the current directory will be read only
const SCORECARDS_DIRECTORY =
  process.env.IS_DEPLOYMENT === "true" ? "/tmp/scorecards" : "./scorecards";

function savePdf(filePath, docDefinition) {
  const fonts = {
    Roboto: {
      normal: path.resolve("./public/fonts/Roboto/Roboto-Regular.ttf"),
      bold: path.resolve("./public/fonts/Roboto/Roboto-Medium.ttf"),
      italics: path.resolve("./public/fonts/Roboto/Roboto-Italic.ttf"),
      bolditalics: path.resolve(
        "./public/fonts/Roboto/Roboto-MediumItalic.ttf"
      ),
    },
  };
  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition);
  if (!fs.existsSync(SCORECARDS_DIRECTORY)) {
    fs.mkdirSync(SCORECARDS_DIRECTORY);
  }
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();
}

function getHeaderWidths() {
  return [60, 60, "*", 60, "*"];
}

function buildHeaders() {
  return [
    { text: "Round", style: "tableHeader", alignment: "center" },
    { text: "Question", style: "tableHeader", alignment: "center" },
    { text: "Response", style: "tableHeader" },
    { text: "Score", style: "tableHeader", alignment: "center" },
    { text: "Correct Answer", style: "tableHeader" },
  ];
}

function buildAnswerRows(modelAnswers, answers, scores) {
  const rows = [];
  modelAnswers.forEach((round, roundNumber) => {
    if (!roundNumber) return; // skip 0, rounds are 1-indexed
    round.forEach((modelAnswer, questionNumber) => {
      if (!questionNumber) return; // skip 0, answers are 1-indexed
      const answer = answers[roundNumber][questionNumber];
      const score = scores[roundNumber][questionNumber];
      rows.push([
        { text: roundNumber, alignment: "center" },
        { text: questionNumber, alignment: "center" },
        answer,
        { text: score, alignment: "center" },
        score === 0 ? modelAnswer : "",
      ]);
    });
  });
  return rows;
}

function buildBonusRow(bonusScore) {
  return [
    { text: "Bonus!", alignment: "center" },
    "",
    "",
    { text: bonusScore, alignment: "center" },
    "",
  ];
}

export function buildScorecardPdf(dataForTeam, modelAnswers, date) {
  const { teamName, answers, scores, bonusScore, totalScore } = dataForTeam;
  const filenameSafeTeamName = teamName.replace(/[/\\?%*:|"<>]/g, "-");
  const filePath = path.join(
    SCORECARDS_DIRECTORY,
    `${filenameSafeTeamName} Scorecard.pdf`
  );
  const docDefinition = {
    content: [
      {
        columns: [
          {
            text: "LOCKED DOWN TRIVIA",
            style: "header",
          },
          {
            alignment: "right",
            text: date,
            style: "header",
          },
        ],
      },
      {
        columns: [
          {
            text: `Team: ${teamName}`,
            style: "subheader",
          },
          {
            alignment: "right",
            text: `Total Score: ${totalScore}`,
            style: "subheader",
          },
        ],
      },
      "\n",
      {
        style: "table",
        table: {
          headerRows: 1,
          widths: getHeaderWidths(),
          body: [
            buildHeaders(),
            ...buildAnswerRows(modelAnswers, answers, scores),
            buildBonusRow(bonusScore),
          ],
        },
        layout: {
          fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#CCCCCC" : null),
          defaultBorder: false,
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      table: {
        margin: [0, 5, 0, 15],
        fillOpacity: 0.3,
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: "black",
      },
    },
  };
  savePdf(filePath, docDefinition);
  return filePath;
}
