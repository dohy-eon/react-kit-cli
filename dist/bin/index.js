#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("../src/cli/commands");
// CLI 실행
const commands = new commands_1.Commands();
commands.parse();
