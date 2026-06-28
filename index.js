#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'node:path';
import { execSync } from 'node:child_process';
import prompts from 'prompts';
import { cyan, green, bold, yellow, red, gray } from 'kolorist';
import ora from 'ora';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const projectName = args[0] || 'myapp';
const targetDir = path.join(process.cwd(), projectName);



if (fs.existsSync(targetDir)) {
  console.error(red(`✖ Directory "${projectName}" already exists.`));
  process.exit(1);
}

const header = {
    message: `  █████     ███                                      █████                        █████                              █████
 ░░███     ░░░                                      ░░███                        ░░███                              ░░███ 
 ███████   ████  ████████   ████████   █████ ████    ░███████   ██████    ██████  ░███ █████  ██████  ████████    ███████ 
░░░███░   ░░███ ░░███░░███ ░░███░░███ ░░███ ░███     ░███░░███ ░░░░░███  ███░░███ ░███░░███  ███░░███░░███░░███  ███░░███ 
  ░███     ░███  ░███ ░███  ░███ ░███  ░███ ░███     ░███ ░███  ███████ ░███ ░░░  ░██████░  ░███████  ░███ ░███ ░███ ░███ 
  ░███ ███ ░███  ░███ ░███  ░███ ░███  ░███ ░███     ░███ ░███ ███░░███ ░███  ███ ░███░░███ ░███░░░   ░███ ░███ ░███ ░███ 
  ░░█████  █████ ████ █████ ████ █████ ░░███████     ████████ ░░████████░░██████  ████ █████░░██████  ████ █████░░████████
   ░░░░░  ░░░░░ ░░░░ ░░░░░ ░░░░ ░░░░░   ░░░░░███    ░░░░░░░░   ░░░░░░░░  ░░░░░░  ░░░░ ░░░░░  ░░░░░░  ░░░░ ░░░░░  ░░░░░░░░ 
                                        ███ ░███                                                                          
                                       ░░██████                                                                           
                                        ░░░░░░                                                                            `,
    by: `d88PPPo 888   88 
888ooo8 888ooo88 
888   8       88 
888PPPP PPPPPP8P 
                  `,
    author: `▗▖  ▗▖▗▄▖  ▗▄▄▖ ▗▄▄▖▗▄▄▄▖▗▖  ▗▖▗▄▄▄▖     ▗▄▖    ▗▖ ▗▄▖  ▗▄▄▖▗▄▄▖  ▗▄▖ ▗▖ ▗▖
 ▝▚▞▘▐▌ ▐▌▐▌   ▐▌     █  ▐▛▚▖▐▌▐▌       ▐▌ ▐▌   ▐▌▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌▐▌ ▐▌
  ▐▌ ▐▛▀▜▌ ▝▀▚▖ ▝▀▚▖  █  ▐▌ ▝▜▌▐▛▀▀▘    ▐▛▀▜▌   ▐▌▐▛▀▜▌▐▌▝▜▌▐▛▀▚▖▐▌ ▐▌▐▌ ▐▌
  ▐▌ ▐▌ ▐▌▗▄▄▞▘▗▄▄▞▘▗▄█▄▖▐▌  ▐▌▐▙▄▄▖    ▐▌ ▐▌▗▄▄▞▘▐▌ ▐▌▝▚▄▞▘▐▌ ▐▌▝▚▄▞▘▝▚▄▞▘
                                                                           
                                                                           
                                                                           `
};


(async function main() {
  console.log(cyan(`\n${header.message}\n${header.by}\n${header.author}\n`));

  const response = await prompts([
    {
      type: 'text',
      name: 'description',
      message: 'Project description',
      initial: 'A tinny-backend application'
    },
    {
      type: 'text',
      name: 'author',
      message: 'Author name',
      initial: 'Yassine Ajagrou'
    }
  ]);


  const templateDir = path.join(__dirname, 'template');
  if (!fs.existsSync(templateDir)) {
    console.error(red(`✖ Template folder not found at ${templateDir}`));
    process.exit(1);
  }

  const spinner = ora('Copying template files...').start();
  try {
    fs.copySync(templateDir, targetDir);
    spinner.succeed(green('Template copied successfully'));
  } catch (err) {
    spinner.fail(red('Failed to copy template'));
    console.error(err);
    process.exit(1);
  }


  const pkgPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = projectName;
    pkg.description = response.description || pkg.description;
    pkg.author = response.author || pkg.author;
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
  }

  const installSpinner = ora('Installing dependencies (npm install)...').start();
  try {
    execSync(`cd "${targetDir}" && npm install`, { stdio: 'pipe' });
    installSpinner.succeed(green('Dependencies installed'));
  } catch (err) {
    installSpinner.fail(red('npm install failed'));
    console.error(err);
    process.exit(1);
  }

  const buildSpinner = ora('Building project (npm run build)...').start();
  try {
    execSync(`cd "${targetDir}" && npm run build`, { stdio: 'pipe' });
    buildSpinner.succeed(green('Build completed'));
  } catch (err) {
    buildSpinner.fail(red('Build failed'));
    console.error(err);
    process.exit(1);
  }

  console.log(cyan('\n▶ Starting the server (npm run start)...\n'));
  console.log(gray('Press Ctrl+C to stop the server when done.\n'));

  try {
    execSync(`cd "${targetDir}" && npm run start`, { stdio: 'inherit' });
  } catch (err) {
    console.log(yellow('\nServer stopped.'));
    process.exit(0);
  }

  console.log(green(`\n✅ Project "${bold(projectName)}" is ready!`));
  console.log(cyan(`   cd ${projectName}`));
  console.log(cyan('   npm run dev   # for development with hot-reload'));
  console.log(cyan('   npm start     # for production (already running)'));
  console.log(gray('\n--------------------------------------------------'));
  console.log(gray('Created by Yassine Ajagrou - https://github.com/iaceene'));
  console.log(gray('--------------------------------------------------\n'));
})().catch((err) => {
  console.error(red('Unexpected error:'), err);
  process.exit(1);
});