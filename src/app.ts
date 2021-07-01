#!/usr/bin/env node

import { Command } from 'commander';
import { scrape } from './scrape';

export const program = new Command();
program
  .argument('<domain>', 'Domain name to scrape')
  .action(async (domain) => {
    const sitemap = await scrape(domain);
    console.log(sitemap);
  });
program.parse();
