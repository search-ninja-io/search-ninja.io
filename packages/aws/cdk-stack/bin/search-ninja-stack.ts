#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SearchNinjaStack } from '../lib/search-ninja-stack';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
const config = dotenvExpand(dotenv.config()).parsed || {};

const stageName = config.STAGE_NAME;
const nameSuffix = stageName[0].toUpperCase() + stageName.slice(1);

const app = new cdk.App();
new SearchNinjaStack(app, 'SearchNinjaStack' + nameSuffix, nameSuffix, config);
