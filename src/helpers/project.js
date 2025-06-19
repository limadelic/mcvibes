import { existsSync } from 'fs';

const detectors = [
  {
    type: 'csharp',
    files: ['*.csproj', '*.sln', 'global.json'],
    test: 'dotnet test --no-build --verbosity quiet'
  },
  {
    type: 'elixir', 
    files: ['mix.exs'],
    test: 'mix test'
  },
  {
    type: 'ruby',
    files: ['Gemfile', '*.gemspec'],
    test: 'bundle exec rspec'
  },
  {
    type: 'node',
    files: ['package.json'],
    test: 'npm test'
  }
];

const exists = (pattern) => {
  if (pattern.includes('*')) {
    // Simple glob check - could be enhanced
    const prefix = pattern.split('*')[0];
    const suffix = pattern.split('*')[1] || '';
    return existsSync('.') && 
           require('fs').readdirSync('.')
             .some(file => file.startsWith(prefix) && file.endsWith(suffix));
  }
  return existsSync(pattern);
};

const detect = () => {
  for (const { type, files, test } of detectors) {
    if (files.some(exists)) {
      return { type, test };
    }
  }
  return { type: 'unknown', test: 'echo "No test command found"' };
};

export const project = detect();

export default { project, detect };