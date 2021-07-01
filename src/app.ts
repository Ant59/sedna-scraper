#!/usr/bin/env node

import { Command } from 'commander';
import fetch from 'node-fetch';
import parseUrl from 'parse-url';
import isValidDomain from 'is-valid-domain';
import { load } from 'cheerio';

type ParsedUrl = ReturnType<typeof parseUrl>;
type Sitemap = Record<string, string[]>;

const unique = <T>(array: T[]): T[] => Array.from(new Set(array));

export const extractLinks = async (url: ParsedUrl) => {
  const response = await fetch(url.href);

  const document = load(await response.text());
  const anchors = document('a')
    .map((_i, el) => document(el).attr('href'))
    .get();

  return unique(anchors)
    .map((link) => parseUrl(link))
    .filter((parsedLink) => parsedLink.resource === url.resource);
};

const buildMap: (sitemap: Sitemap, url: ParsedUrl) => Promise<Sitemap> = async (
  sitemap,
  url
) => {
  if (sitemap.hasOwnProperty(url.href)) return sitemap;

  const links = await extractLinks(url);
  sitemap[url.href] = links.map((link) => link.href);

  return links.reduce(
    async (sitemap, link) => await buildMap(await sitemap, link),
    Promise.resolve(sitemap)
  );
};

export const scrape = async (domain: string) => {
  const domainUrl = parseUrl(domain, true);

  if (!isValidDomain(domainUrl.resource)) {
    console.error('Invalid domain name');
    return;
  }

  if (domainUrl.pathname) {
    console.error('Domain name should not include path');
    return;
  }

  return await buildMap({}, domainUrl);
};

export const program = new Command();
program
  .argument('<domain>', 'Domain name to scrape')
  .action((domain) => console.log(scrape(domain)));
// program.parse();
