import stripAnsi from 'strip-ansi';
import { TestRun, Group, Strategy } from '@skills17/test-result';
import Printer from '../../src/Printer';
import { mockConsoleToString } from '../helpers';

const expectedOutput = `------------       RESULT       ------------

Summary:
  A.+: 1/1 point
    ✔ Foo: ok
  B.+: 2/3 points
    ✔ Foo: ok
    ✔ Bar: ok
    ✖ Baz: failed
  C.+: 2/2 points
    ✔ Foo: ok
    ✔ Bar: ok
  D.+: 0/1 point
    ✖ Foo: failed
  E.+: 1/2 points
    ✔ Foo: ok
    ✖ Bar: failed
  F.+: 1/2 points
    ✔ Foo: ok
    ✖ Bar: failed

Info: The detailed test and error information is visible above the result summary.

WARNING: The following tests do NOT have extra tests and so can NOT be checked for possible cheating:
  - E.+ > Foo
  - F.+ > Foo
  - F.+ > Bar
`;

describe('extra tests missing', () => {
  it('prints the test run', () => {
    const run = new TestRun();

    run.addGroup(new Group('A.+', 1, Strategy.Add));
    run.addGroup(new Group('B.+', 1, Strategy.Add));
    run.addGroup(new Group('C.+', 1, Strategy.Add));
    run.addGroup(new Group('D.+', 1, Strategy.Add));
    run.addGroup(new Group('E.+', 1, Strategy.Add));
    run.addGroup(new Group('F.+', 1, Strategy.Add));

    // normal tests
    run.recordTest('AFoo', 'Foo', false, true);
    run.recordTest('BFoo', 'Foo', false, true);
    run.recordTest('BBar', 'Bar', false, true);
    run.recordTest('BBaz', 'Baz', false, false);
    run.recordTest('CFoo', 'Foo', false, true);
    run.recordTest('CBar', 'Bar', false, true);
    run.recordTest('DFoo', 'Foo', false, false);
    run.recordTest('EFoo', 'Foo', false, true); // this does not have an extra test and should trigger a warning
    run.recordTest('EBar', 'Bar', false, false);
    run.recordTest('FFoo', 'Foo', false, true); // this does not have an extra test and should trigger a warning
    run.recordTest('FBar', 'Bar', false, false); // this does not have an extra test and should trigger a warning

    // extra tests
    run.recordTest('AFoo', 'Foo', true, true);
    run.recordTest('BFoo', 'Foo', true, true);
    run.recordTest('BBar', 'Bar', true, true);
    run.recordTest('BBaz', 'Baz', true, false);
    run.recordTest('CFoo', 'Foo', true, true);
    run.recordTest('CBar', 'Bar', true, true);
    run.recordTest('DFoo', 'Foo', true, true);
    run.recordTest('EBar', 'Bar', true, true);

    const log = jest.fn();

    const printer = new Printer(run);
    printer.print({ printer: log });

    expect(stripAnsi(mockConsoleToString(log))).toEqual(expectedOutput);
  });
});
