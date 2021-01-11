import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 1/1 point
    ✔ AFoo: ok

WARNING: The following groups do not have any test:
  - B.+
`;

describe('no footer', () => {
  it('prints no footer', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add));

    run.recordTest('AFoo', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log, printFooter: false });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
