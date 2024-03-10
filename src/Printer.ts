import { bgGreen, black, blue, bold, green, red, underline, yellow } from 'chalk';
import { cross, tick } from 'figures';
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
    printPoints = true,
  }: {
    printer?: (...data: string[]) => void;
    printHeader?: boolean;
    printFooter?: boolean;
    printPoints?: boolean;
  } = {}): void {
    // print header
    if (printHeader) {
      printer(bgGreen(black('------------       RESULT       ------------')));
      printer('\nSummary:');
    }

    // print groups
    this.run.getGroups().forEach((group) => {
      // skip groups without any test
      if (group.getTests().length === 0) {
        return;
      }

      const points = group.getPoints();
      const maxPoints = group.getMaxPoints();
      const groupName = bold(underline(group.getDisplayName()));
      const pointsText = `${points}/${maxPoints} point${maxPoints !== 1 ? 's' : ''}`;
      const pointsColor = this.getPointsColor(points, maxPoints);
      let manualCheck = '';

      if (group.requiresManualCheck()) {
        manualCheck = bold(yellow(' [manual check required]'));
      }

      if (printPoints) {
        printer(`  ${groupName}${blue(':')} ${pointsColor(pointsText)}${manualCheck}`);
      } else {
        printer(`  ${groupName}${manualCheck}`);
      }

      // print all tests of this group
      group.getTests().forEach((test) => {
        let resultText = '';
        let resultColor = green;
        let resultSymbol = tick;

        if (test.requiresManualCheck()) {
          resultText = ' please check manually for static return values and/or logical errors';
          resultColor = yellow;
          resultSymbol = '?';
        } else if (!test.isSuccessful()) {
          resultColor = red;
          resultSymbol = cross;
        }

        const symbol = bold(resultColor(resultSymbol));

        printer(`    ${symbol} ${test.getName()}${resultColor(resultText)}`);
      });
    });

    // print footer
    if (printFooter) {
      if (printPoints) {
        this.printTotal(printer);
      }
      printer(
        `\n${blue('Info:')}`,
        'The detailed test and error information is visible above the result summary.',
      );
    }

    this.printWarnings(printer);
    printer();
  }

  private getPointsColor(points: number, maxPoints: number) {
    if (points > 0) {
      return points === maxPoints ? green : yellow;
    }
    return red;
  }

  private printTotal(printer: (...data: string[]) => void) {
    const totalPoints = this.run
      .getGroups()
      .reduce((groupPoints, group) => groupPoints + group.getPoints(), 0);
    const totalMaxPoints = this.run
      .getGroups()
      .reduce((groupPoints, group) => groupPoints + group.getMaxPoints(), 0);

    const totalPointsRounded = Math.round(totalPoints * 100) / 100;
    const totalMaxPointsRounded = Math.round(totalMaxPoints * 100) / 100;

    const totalPointsColor = this.getPointsColor(totalPoints, totalMaxPoints);

    printer(
      `\nTotal: ${totalPointsColor(
        `${totalPointsRounded}/${totalMaxPointsRounded} point${
          totalMaxPointsRounded !== 1 ? 's' : ''
        }`,
      )}`,
    );
  }

  private printWarnings(printer: (...data: string[]) => void): void {
    // search for groups without tests
    const emptyGroups = this.run
      .getGroups()
      .filter((group) => !group.hasTests())
      .map((group) => group.getDisplayName());
    if (this.run.hasExtraTest() && emptyGroups.length > 0) {
      this.printTestWarning('The following groups do not have any test:', emptyGroups, printer);
    }

    // search for tests that do not have extra tests
    const missingExtraTests = this.run
      .getGroups()
      .map((group) =>
        group.getMissingExtraTests().map((test) => `${group.getDisplayName()} > ${test.getName()}`),
      )
      .filter((tests) => tests.length > 0);
    if (this.run.hasExtraTest() && missingExtraTests.length > 0) {
      this.printTestWarning(
        'The following tests do NOT have extra tests and so can NOT be checked for possible cheating:',
        missingExtraTests.flat(),
        printer,
      );
    }

    // search for extra tests that do not have a normal test
    const missingNormalTests = this.run
      .getGroups()
      .map((group) =>
        group.getMissingNormalTests().map((test) => `${group.getDisplayName()} > ${test}`),
      )
      .filter((tests) => tests.length > 0);
    if (missingNormalTests.length > 0) {
      this.printTestWarning(
        'The following extra tests do not belong to a main test and were ignored:',
        missingNormalTests.flat(),
        printer,
      );
    }

    // search for tests that do not belong to any group
    if (this.run.getUngroupedTests().length > 0) {
      this.printTestWarning(
        'The following tests do not belong to a group and were ignored:',
        this.run.getUngroupedTests(),
        printer,
      );
    }
  }

  private printTestWarning(
    warning: string,
    tests: string[],
    printer: (...data: string[]) => void,
  ): void {
    printer();
    printer(yellow('WARNING:', warning));

    tests.forEach((test) => {
      printer(`  - ${test}`);
    });
  }
}
