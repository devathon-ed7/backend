import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Electronics", description: "Devices and gadgets", parentCategoryId: null },
  { name: "Computers", description: "Desktops and laptops", parentCategoryId: null },
  { name: "Smartphones", description: "Mobile phones and accessories", parentCategoryId: null },
  { name: "Home Appliances", description: "Appliances for home use", parentCategoryId: null },
  { name: "Refrigerators", description: "Cooling appliances for food", parentCategoryId: null },
  { name: "Washing Machines", description: "Machines for laundry", parentCategoryId: null },
  { name: "Furniture", description: "Home and office furniture", parentCategoryId: null },
  { name: "Chairs", description: "Seating furniture", parentCategoryId: null },
  { name: "Tables", description: "Furniture for dining and working", parentCategoryId: null },
  { name: "Toys", description: "Children's toys and games", parentCategoryId: null },
  { name: "Action Figures", description: "Collectible figures", parentCategoryId: null },
  { name: "Board Games", description: "Games played on a board", parentCategoryId: null },
];

async function main() {

  const createdCategories = await Promise.all(
    categories.map(async (category) => {
      return await prisma.category.create({
        data: {
          name: category.name,
          description: category.description,
          parentCategoryId: category.parentCategoryId
        }
      });
    })
  );


  await Promise.all([
    prisma.category.update({
      where: { id: createdCategories[0].id }, // Electronics
      data: {
        children: {
          connect: [
            { id: createdCategories[1].id }, // Computers
            { id: createdCategories[2].id }, // Smartphones
          ]
        }
      }
    }),

    prisma.category.update({
      where: { id: createdCategories[3].id }, // Home Appliances
      data: {
        children: {
          connect: [
            { id: createdCategories[4].id }, // Refrigerators
            { id: createdCategories[5].id }, // Washing Machines
          ]
        }
      }
    }),
    prisma.category.update({
      where: { id: createdCategories[6].id }, // Furniture
      data: {
        children: {
          connect: [
            { id: createdCategories[7].id }, // Chairs
            { id: createdCategories[8].id }, // Tables
          ]
        }
      }
    }),
    prisma.category.update({
      where: { id: createdCategories[9].id }, // Toys
      data: {
        children: {
          connect: [
            { id: createdCategories[10].id }, // Action Figures
            { id: createdCategories[11].id }, // Board Games
          ]
        }
      }
    }),
  ]);

  console.log("Data added successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });