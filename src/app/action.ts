"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string; // YYYY-MM-DD
  const startTime = formData.get("startTime") as string; // HH:mm
  const endTime = formData.get("endTime") as string; // HH:mm
  const color = formData.get("color") as string;

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

  await prisma.event.create({
    data: {
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      color: color || "blue",
    },
  });

  revalidatePath("/");
}

export async function getEvents() {
  const events = await prisma.event.findMany();
  return events;
}

export async function deleteEvent(id: string) {
  await prisma.event.delete({
    where: { id },
  });
  revalidatePath("/");
}


export async function updateEvent(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const color = formData.get("color") as string;

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

  await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      startTime: startDateTime,
      endTime: endDateTime,
      color: color || "blue",
    },
  });

  revalidatePath("/");
}