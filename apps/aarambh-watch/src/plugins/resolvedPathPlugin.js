import path from 'path';

export default function logResolvedPathsPlugin() {
  return {
    name: 'log-resolved-paths',
    resolveId(source, importer) {
      if (importer) {
        const resolvedPath = path.resolve(path.dirname(importer), source);
        console.log(`Resolving: ${source}`);
        console.log(`Importer: ${importer}`);
        console.log(`Resolved Path: ${resolvedPath}\n`);
      } else {
        console.log(`Resolving: ${source}`);
        console.log(`No importer available\n`);
      }
      return null; // Returning null to let Vite handle the actual resolution
    },
    buildEnd(error) {
      if (error) {
        console.error('Build failed:', error);
      } else {
        console.log('Build completed successfully.');
      }
    }
  };
}