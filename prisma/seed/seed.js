const { PrismaClient } = require('@prisma/client')
const favorites_categories = require('./sc-favorites-categories.json')

const prisma = new PrismaClient()

async function loadCategories(){
    const allCategories = favorites_categories[]
}

async function main() {
    const categories = await loadCategories()
}

main()
.catch((e) => {
    throw e
})
.finally(async () =>{
    await prisma.$disconnect()
})