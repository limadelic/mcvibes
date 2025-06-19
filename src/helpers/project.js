import { existsSync, readdirSync } from 'fs';

const detectors = [
  ['csharp', ['*.csproj', '*.sln'], 'dotnet test --no-build --verbosity quiet'],
  ['elixir', ['mix.exs'], 'mix test'],
  ['ruby', ['Gemfile', '*.gemspec'], 'bundle exec rspec'],
  ['node', ['package.json'], 'npm test']
];

const glob = (pattern) => {
  const [prefix, suffix] = pattern.split('*');
  return readdirSync('.').some(f => 
    f.startsWith(prefix) && f.endsWith(suffix || ''));
};

const exists = (file) => 
  file.includes('*') ? glob(file) : existsSync(file);

const detect = () => 
  detectors.find(([, files]) => files.some(exists)) ||
  ['unknown', [], 'echo "No test command found"'];

export const project = { 
  type: detect()[0], 
  test: detect()[2] 
};

export default project;