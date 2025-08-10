#!/usr/bin/env node

import { Commands } from '../src/cli/commands';

// CLI 실행
const commands = new Commands();
commands.parse();
