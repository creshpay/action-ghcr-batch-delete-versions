#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { Octokit } = require('octokit')
const { cleaner } = require('../features/cleaner')

const argv = yargs(hideBin(process.argv)).argv

const { packageName, org, selector = '', excluder = '', packageType = '', dryRun = '1' } = argv

const octokit = new Octokit({ auth: argv.token })

cleaner(octokit, packageName, org, packageType, selector.replace(/#/g, '\r\n'), excluder.replace(/#/g, '\r\n'), dryRun)