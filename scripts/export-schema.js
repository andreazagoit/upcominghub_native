/**
 * Script per esportare lo schema GraphQL dal server Next.js
 * Richiede che il server Next.js sia in esecuzione su localhost:3000
 */

const fs = require('fs');
const path = require('path');
const {getIntrospectionQuery, buildClientSchema, printSchema} = require('graphql');

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'http://localhost:3000/api/graphql';
const OUTPUT_PATH = path.join(__dirname, '..', 'graphql', 'schema.graphql');

async function exportSchema() {
  try {
    console.log(`🔍 Fetching schema from ${GRAPHQL_ENDPOINT}...`);
    
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const {data} = await response.json();
    
    if (!data) {
      throw new Error('No data received from GraphQL endpoint');
    }

    const schema = buildClientSchema(data);
    const sdl = printSchema(schema);

    // Ensure directory exists
    const dir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true});
    }

    fs.writeFileSync(OUTPUT_PATH, sdl);
    
    console.log(`✅ Schema exported successfully to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Error exporting schema:', error.message);
    console.error('\n💡 Make sure the Next.js server is running on localhost:3000');
    console.error('   Run: cd ../upcominghub-next && npm run dev');
    process.exit(1);
  }
}

exportSchema();

