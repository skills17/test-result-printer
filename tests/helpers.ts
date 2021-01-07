// eslint-disable-next-line import/prefer-default-export
export const mockConsoleToString = (log: jest.Mock): string =>
  log.mock.calls.map((call) => call.join(' ')).join('\n');
