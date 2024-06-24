const fs = require('fs');
const readline = require('readline');

async function processGcode(inputFile, outputFile) {
  const fileStream = fs.createReadStream(inputFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const filteredLines = [];
  let previousLine = null;
  let previous2LinesBack = null;

  for await (const line of rl) {
    if (line.trim() === '') {
      continue;
    }

    if (line === previousLine || line === previous2LinesBack) {
      continue;
    }

    filteredLines.push(line);

    previous2LinesBack = previousLine;
    previousLine = line;
  }

  fs.writeFileSync(outputFile, filteredLines.join('\n'), 'utf8');
  console.log(`Processed file saved as ${outputFile}`);
}

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('Usage: node cleaner.js <inputFile.gcode>');
  process.exit(1);
}

const inputFile = args[0];
const outputFile = `cleaned_${inputFile}`;

processGcode(inputFile, outputFile).catch(err => console.error(err));
