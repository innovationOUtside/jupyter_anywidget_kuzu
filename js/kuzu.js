import "./kuzu.css";
import html from "./kuzu.html";
import { generateUUID } from "./uuid";
import {kuzu} from "https://cdn.jsdelivr.net/npm/kuzu-wasm@0.9.0/index.min.js";

function render({ model, el }) {

  let el2 = document.createElement("div");
  el2.innerHTML = html;
  const uuid = generateUUID();
  el2.id = uuid;
  el.appendChild(el2);

const appendOutput = (text) => {
  const output = document.getElementById(uuid);
  output.innerText += text + "\n";
};
(async () => {
  // Write the data into WASM filesystem
  const userCSV = `Adam,30
Karissa,40
Zhang,50
Noura,25`;
  const cityCSV = `Waterloo,150000
Kitchener,200000
Guelph,75000`;
  const followsCSV = `Adam,Karissa,2020
Adam,Zhang,2020
Karissa,Zhang,2021
Zhang,Noura,2022`;
  const livesInCSV = `Adam,Waterloo
Karissa,Waterloo
Zhang,Kitchener
Noura,Guelph`;
  await kuzu.FS.writeFile("/user.csv", userCSV);
  await kuzu.FS.writeFile("/city.csv", cityCSV);
  await kuzu.FS.writeFile("/follows.csv", followsCSV);
  await kuzu.FS.writeFile("/lives-in.csv", livesInCSV);

  // Create an empty database and connect to it
  const db = new kuzu.Database("");
  const conn = new kuzu.Connection(db);

  const queries = [
    // Create the tables
    "CREATE NODE TABLE User(name STRING, age INT64, PRIMARY KEY (name))",
    "CREATE NODE TABLE City(name STRING, population INT64, PRIMARY KEY (name))",
    "CREATE REL TABLE Follows(FROM User TO User, since INT64)",
    "CREATE REL TABLE LivesIn(FROM User TO City)",
    // Load the data
    "COPY User FROM 'user.csv'",
    "COPY City FROM 'city.csv'",
    "COPY Follows FROM 'follows.csv'",
    "COPY LivesIn FROM 'lives-in.csv'",
  ];

  appendOutput("Setting up the database...");

  // Execute the queries to setup the database
  for (const query of queries) {
    appendOutput("Executing query: " + query);
    const queryResult = await conn.query(query);
    const outputString = await queryResult.toString();
    appendOutput(outputString);
    await queryResult.close();
  }
  appendOutput("Database setup complete.");
  appendOutput("");

  // Query the database
  let queryString =
    "MATCH (u:User) -[f:Follows]-> (v:User) RETURN u.name, f.since, v.name";
  appendOutput("Executing query: " + queryString);
  let queryResult = await conn.query(queryString);
  let rows = await queryResult.getAllObjects();
  appendOutput("Query result:");
  for (const row of rows) {
    appendOutput(
      `User ${row["u.name"]} follows ${row["v.name"]} since ${row["f.since"]}`
    );
  }
  await queryResult.close();

  appendOutput("");

  queryString = "MATCH (u:User) -[l:LivesIn]-> (c:City) RETURN u.name, c.name";
  appendOutput("Executing query: " + queryString);
  queryResult = await conn.query(queryString);
  rows = await queryResult.getAllObjects();
  appendOutput("Query result:");
  // Print the rows
  for (const row of rows) {
    appendOutput(`User ${row["u.name"]} lives in ${row["c.name"]}`);
  }
  await queryResult.close();
  appendOutput("");

  appendOutput("All queries executed successfully.");

  // Close the connection
  await conn.close();
  appendOutput("Connection closed.");

  // Close the database
  await db.close();
  appendOutput("Database closed.");
})();
}

export default { render };