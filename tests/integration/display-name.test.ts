import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 1/1 point
    ✔ AFoo: ok
  BGroup::foo: 1/1 point
    ✔ BFoo: ok
  Last group: 1/1 point
    ✔ CFoo: ok

Info: The detailed test and error information is visible above the result summary.
`;

describe('display name', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add, 'BGroup::foo'));
    run.addGroup(new Group('C.+', 1, Strategy.Add, 'Last group'));

    run.recordTest('AFoo', false, true);
    run.recordTest('BFoo', false, true);
    run.recordTest('CFoo', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
