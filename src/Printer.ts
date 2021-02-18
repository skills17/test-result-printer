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
      printer(
        `\n${blue('Info:')}`,
        'The detailed test and error information is visible above the result summary.',
      );
    }

    this.printWarnings(printer);
    printer();
  }

  private printWarnings(printer: (...data: string[]) => void): void {
    // search for groups without tests
    const emptyGroups = this.run
      .getGroups()
      .filter((group) => !group.hasTests())
      .map((group) => group.getDisplayName());
    if (emptyGroups.length > 0) {
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
    if (this.run.hasExtraTest() && this.run.getUngroupedTests().length > 0) {
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
