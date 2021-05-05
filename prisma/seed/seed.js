const { PrismaClient } = require('@prisma/client')
const favorites_categories = require('./sc-favorites-categories.json')

const prisma = new PrismaClient()

async function loadCategories(){
    const allCategories = favorites_categories['comet'].seedData
        return allCategories.map((category) =>{
            return{
                data: {
                    name: category.name,
                    maxSize: category.maxSize,
                }
            }
        })
}

async function main() {
    const categories = await loadCategories()
    for (const category of categories){
        try{
            await prisma.seedData.create(category)
        } catch (error) {
            console.log(`Error creating Categories: ${error}`)
        }
    }
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () =>{
    await prisma.$disconnect()
})