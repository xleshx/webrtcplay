import { randomToken } from '../util';

test('Returns current system network addresses', () => {
    expect(randomToken()).toHaveLength(13);
});
