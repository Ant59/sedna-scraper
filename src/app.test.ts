import * as app from './app';

test.todo('Commander');

test('Should return early and fail for invalid domains', async () => {
  console.error = jest.fn();

  await app.scrape('notadomainname');

  expect(console.error).toHaveBeenCalledWith('Invalid domain name');
});

test('Should fetch homepage for valid domain', async () => {
  await app.scrape('www.example.com');
});

test('Should allow domain with protocol', async () => {
  await app.scrape('https://www.example.com');
});

test('Complex site with many links', async () => {
  const output = await app.scrape('https://www.sedna.com');
  console.log(output);
});

test('Should never scrape same page twice', async () => {
  const spy = jest.spyOn(app, 'extractLinks');
  await app.scrape('https://www.sedna.com');
  const scrapedUrls = spy.mock.calls.map(call => call[0].href);
  expect(scrapedUrls.length === new Set(scrapedUrls).size).toBe(true);
});
