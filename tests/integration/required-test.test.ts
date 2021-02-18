import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy, Override } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 0/3 points
    ✔ Foo: ok
    ✖ Bar: failed
    ✖ Required: failed
  B.+: 0/2 points
    ✔ Foo: ok
    ✔ Bar: ok
    ✖ Required: failed
  C.+: 2/2 points
    ✔ Foo: ok
    ✔ Required: ok

Info: The detailed test and error information is visible above the result summary.
`;

describe('required test', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    const groupA = new Group('A.+', 1, Strategy.Add);
    groupA.addOverride(new Override('Required', true));
    run.addGroup(groupA);
    const groupB = new Group('B.+', 1, Strategy.Deduct, undefined, 2);
    groupB.addOverride(new Override('Required', true));
    run.addGroup(groupB);
    const groupC = new Group('C.+', 1, Strategy.Add);
    groupC.addOverride(new Override('Required', true));
    run.addGroup(groupC);

    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('ABar', 'Bar', false, false);
    run.recordTest('ARequired', 'Required', false, false); // because this fails and is required, group A should award 0 points
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);
    run.recordTest('BRequired', 'Required', false, false); // because this fails and is required, group B should award 0 points
    run.recordTest('CFoo', 'Foo', false, true);
    run.recordTest('CRequired', 'Required', false, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
