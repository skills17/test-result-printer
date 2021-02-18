import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 1/1 point
    ✔ Foo

WARNING: The following tests do not belong to a group and were ignored:
  - BFoo
`;

describe('no footer', () => {
  it('prints no footer', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));

    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('BFoo', 'Foo', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log, printFooter: false });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
