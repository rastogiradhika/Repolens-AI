/**
 * Tech Stack Extractor
 * Identifies languages, frameworks, databases, and core dependencies.
 */
export const techStackExtractor = {
  name: 'techStack',

  run(files, metadata) {
    const buildFiles = files.filter((f) => f.category === 'build');
    const techFiles = files.filter((f) => f.category === 'techStack');
    
    const result = {
      primaryLanguage: metadata?.primaryLanguage || null,
      frameworks: [],
      dependencies: [],
      tools: [],
    };

    // Analyze Node.js package.json
    const pkgJson = buildFiles.find((f) => f.path.endsWith('package.json'));
    if (pkgJson && pkgJson.content) {
      try {
        const pkg = JSON.parse(pkgJson.content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        // Extract frameworks
        if (deps['next']) result.frameworks.push('Next.js');
        if (deps['react']) result.frameworks.push('React');
        if (deps['express']) result.frameworks.push('Express');
        if (deps['vue']) result.frameworks.push('Vue');
        if (deps['svelte']) result.frameworks.push('Svelte');
        if (deps['@nestjs/core']) result.frameworks.push('NestJS');
        if (deps['tailwindcss']) result.tools.push('Tailwind CSS');
        if (deps['typescript']) result.tools.push('TypeScript');
        if (deps['prisma']) result.tools.push('Prisma');
        
        // Take top 15 dependencies for context
        result.dependencies.push(...Object.keys(deps).slice(0, 15));
      } catch (err) {
        // Ignore JSON parse errors for broken package.json
      }
    }

    // Analyze Python requirements.txt
    const reqTxt = buildFiles.find((f) => f.path.endsWith('requirements.txt'));
    if (reqTxt && reqTxt.content) {
      const deps = reqTxt.content.split('\n').map(l => l.split('==')[0].trim()).filter(Boolean);
      if (deps.includes('django')) result.frameworks.push('Django');
      if (deps.includes('fastapi')) result.frameworks.push('FastAPI');
      if (deps.includes('flask')) result.frameworks.push('Flask');
      result.dependencies.push(...deps.slice(0, 15));
    }

    // Analyze Go go.mod
    const goMod = buildFiles.find((f) => f.path.endsWith('go.mod'));
    if (goMod && goMod.content) {
      const lines = goMod.content.split('\n');
      for (const line of lines) {
        if (line.includes('github.com/gin-gonic/gin')) result.frameworks.push('Gin');
        if (line.includes('github.com/gofiber/fiber')) result.frameworks.push('Fiber');
      }
    }

    // Deduplicate
    result.frameworks = [...new Set(result.frameworks)];
    result.dependencies = [...new Set(result.dependencies)];
    result.tools = [...new Set(result.tools)];

    return result;
  },
};
