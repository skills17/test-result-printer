import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `  A.+: 1/1 point
    ✔ Foo

Info: The detailed test and error information is visible above the result summary.
`;

describe('no header', () => {
  it('prints no header', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));

    run.recordTest('AFoo', 'Foo', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log, printHeader: false });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
