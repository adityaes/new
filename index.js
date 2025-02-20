import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const makeCommits = (n) => {
  if (n === 0) return simpleGit().push();

  // Random past date within the last year but **only up to today**
  const daysAgo = random.int(0, moment().diff(moment().subtract(1, "y"), "days")); // Prevents future commits
  const baseDate = moment().subtract(daysAgo, "days");

  // Random number of commits for this day (1 to 5)
  const commitsPerDay = random.int(1, 5);

  for (let i = 0; i < commitsPerDay; i++) {
    const preciseTime = baseDate
      .clone()
      .add(random.int(0, 23), "h") // Random hour
      .add(random.int(0, 59), "m") // Random minute
      .format();

    const data = { date: preciseTime };
    console.log(preciseTime);

    jsonfile.writeFile(path, data, () => {
      simpleGit()
        .add([path])
        .commit(preciseTime, { "--date": preciseTime }, () => {
          if (i === commitsPerDay - 1) makeCommits(n - 1); // Move to next commit batch
        });
    });
  }
};

makeCommits(200);
