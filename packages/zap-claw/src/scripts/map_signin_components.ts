import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = "olympus";
const COLLECTION_NAME = "SYS_OS_component_registry";

const mappings = [
  { coreName: "Button", metroRef: "Button" },
  { coreName: "Input", metroRef: "inputs" },
  { coreName: "Checkbox", metroRef: "checkbox" },
  { coreName: "Form", metroRef: "FormEngine" },
  { coreName: "FormControl", metroRef: "FormEngine" },
  { coreName: "FormField", metroRef: "FormEngine" },
  { coreName: "FormItem", metroRef: "FormEngine" },
  { coreName: "FormLabel", metroRef: "FormEngine" },
  { coreName: "FormMessage", metroRef: "FormEngine" },
];

async function run() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const collection = db.collection(COLLECTION_NAME);

    console.log(`Starting mapping update for ${mappings.length} components...`);

    for (const mapping of mappings) {
      const result = await collection.updateMany(
        { name: mapping.coreName, genesisOrigin: "CORE" },
        { 
          $set: { 
            metroRef: mapping.metroRef,
            activeOrigin: "CORE" // Default to CORE for stability during analysis
          } 
        }
      );
      console.log(`Updated ${mapping.coreName}: ${result.modifiedCount} documents matched.`);
    }

    console.log("Mapping complete.");
  } catch (error) {
    console.error("Error updating registry:", error);
  } finally {
    await client.close();
  }
}

run();
