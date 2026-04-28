import { Client, Account, ID} from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Updated variable name
  .setProject(import.meta.env.VITE_APPWRITE_ID); // Updated variable name

const account = new Account(client);

export { client, account, ID };

