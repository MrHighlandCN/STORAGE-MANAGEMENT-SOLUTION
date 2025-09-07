"use server"

import { Account, Avatars, Client, Databases, Storage, TablesDB } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const createSessionClent = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    // redirect('sign-in');
    // return;
    throw new Error("No session found");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },
  };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.appwriteSecret);



  return {
    get account() {
      return new Account(client);
    },
    get tablesDB() {
      return new TablesDB(client);
    },
    get storage() {
        return new Storage(client);
    },
    get avatars() {
        return new Avatars(client);
    }
  };
};
