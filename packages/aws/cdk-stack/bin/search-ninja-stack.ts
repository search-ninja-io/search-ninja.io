#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { SearchNinjaStack } from "../lib/search-ninja-stack";

const nameSuffix = "Dev";

const app = new cdk.App();
new SearchNinjaStack(app, "SearchNinjaStack" + nameSuffix, nameSuffix);
