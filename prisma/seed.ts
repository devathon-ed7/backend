import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [{ name: "Admin" }, { name: "Seller" }];

const permissions = [
  { name: "create" },
  { name: "read" },
  { name: "update" },
  { name: "delete" }
];

const categories = [
  {
    name: "Electronics",
    description: "Devices and gadgets",
    categoryId: null // Root category
  },
  {
    name: "Computers",
    description: "Desktops and laptops",
    categoryId: 1 // Parent category: Electronics
  },
  {
    name: "Smartphones",
    description: "Mobile phones and accessories",
    categoryId: 1 // Parent category: Electronics
  },
  {
    name: "Home Appliances",
    description: "Appliances for home use",
    categoryId: null // Root category
  },
  {
    name: "Refrigerators",
    description: "Cooling appliances for food",
    categoryId: 4 // Parent category: Home Appliances
  },
  {
    name: "Washing Machines",
    description: "Machines for laundry",
    categoryId: 4 // Parent category: Home Appliances
  },
  {
    name: "Furniture",
    description: "Home and office furniture",
    categoryId: null // Root category
  },
  {
    name: "Chairs",
    description: "Seating furniture",
    categoryId: 7 // Parent category: Furniture
  },
  {
    name: "Tables",
    description: "Furniture for dining and working",
    categoryId: 7 // Parent category: Furniture
  },
  {
    name: "Toys",
    description: "Children's toys and games",
    categoryId: null // Root category
  },
  {
    name: "Action Figures",
    description: "Collectible figures",
    categoryId: 10 // Parent category: Toys
  },
  {
    name: "Board Games",
    description: "Games played on a board",
    categoryId: 10 // Parent category: Toys
  }
];

/* MAIN */

async function main() {
  /*
  await prisma.role.createMany({
    data: roles
  });

  await prisma.permissions.createMany({
    data: permissions
  });

  await prisma.role_permission.createMany({
    data: [
      { role_id: 1, permission_id: 1 },
      { role_id: 1, permission_id: 2 },
      { role_id: 1, permission_id: 3 },
      { role_id: 1, permission_id: 4 },
      { role_id: 2, permission_id: 2 }
    ]
  });

   await prisma.user_accounts.create({
    data: {
      email: "test@test.com",
      password: "test",
      full_name: "Test User"
    }
  }); */

  await prisma.user_details.create({
    data: {
      description: "Test description",
      notes: "Test notes",
      profile_filename:
        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/715d519f-0e05-4956-8f99-a0dbfd96709f/d2qc5jy-ecc1acd3-c013-4a9e-a6ac-92dbba8c81aa.jpg/v1/fit/w_564,h_770,q_70,strp/tony_stark_vector_by_predator_fan_d2qc5jy-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzcwIiwicGF0aCI6IlwvZlwvNzE1ZDUxOWYtMGUwNS00OTU2LThmOTktYTBkYmZkOTY3MDlmXC9kMnFjNWp5LWVjYzFhY2QzLWMwMTMtNGE5ZS1hNmFjLTkyZGJiYThjODFhYS5qcGciLCJ3aWR0aCI6Ijw9NTY0In1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.C7ScGgbns00_2FZwff_ZFgFYcLYsAEG2dlLh2VYrIac",
      user_account_id: 3,
      role_id: 2
    }
  });

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
        description: category.description,
        categoryId: category.categoryId
      }
    });
  }

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
