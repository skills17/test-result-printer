import { bold, underline, black, blue, bgGreen, green, yellow, red } from 'chalk';
import { tick, cross } from 'figures';
import { TestRun } from '@skills17/test-result';

export default class Printer {
  constructor(private run: TestRun) {}

  /**
   * Prints the test run to the console in a nice format.
   */
  public print({
    printer = console.log,
    printHeader = true,
    printFooter = true,
  }: {
    printer?: (...data: string[]) => void;
    printHeader?: boolean;
    printFooter?: boolean;
  }): void {
    // print header
    if (printHeader) {
      printer(bgGreen(black('------------       RESULT       ------------')));
      printer('\nSummary:');
    }

    // print groups
    this.run.getGroups().forEach((group) => {
      const points = group.getPoints();
      const maxPoints = group.getMaxPoints();
      const groupName = bold(underline(group.getDisplayName()));
      const pointsText = `${points}/${maxPoints} point${maxPoints !== 1 ? 's' : ''}`;
      let pointsColor = green;
      let manualCheck = '';

      if (points < maxPoints) {
        if (points > 0) {
          pointsColor = yellow;
        } else {
          pointsColor = red;
        }
      }

      if (group.requiresManualCheck()) {
        manualCheck = bold(yellow(' [manual check required]'));
      }

      printer(`  ${groupName}${blue(':')} ${pointsColor(pointsText)}${manualCheck}`);

      // print all tests of this group
      group.getTests().forEach((test) => {
        let resultText = 'ok';
        let resultColor = green;
        let resultSymbol = tick;

        if (test.requiresManualCheck()) {
          resultText = 'please check manually for static return values and/or logical errors';
          resultColor = yellow;
          resultSymbol = '?';
        } else if (!test.isSuccessful()) {
          resultText = 'failed';
          resultColor = red;
          resultSymbol = cross;
        }

        const symbol = bold(resultColor(resultSymbol));
        const warning = resultSymbol === '?' ? yellow(' WARNING:') : '';

        printer(`    ${symbol} ${test.getName()}${blue(':')}${warning} ${resultText}`);
      });
    });

    // print footer
    if (printFooter) {
      printer(
        `\n${blue('Info:')}`,
        'The detailed test and error information is visible above the result summary.\n',
      );
    }
  }
}
