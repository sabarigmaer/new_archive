import prisma from './src/lib/prisma'

/**
 * Deletes a gallery and all its associated files from the database.
 * @param galleryId The ID of the gallery to delete.
 */
async function deleteGalleryWithFiles(galleryId: number) {
  // Delete all files associated with the gallery
  await prisma.file.deleteMany({
    where: { galleryId }
  })

  // Delete the gallery itself
  await prisma.gallery.delete({
    where: { id: galleryId }
  })

  console.log(`Gallery ${galleryId} and its files deleted.`)
}

// CLI usage: node delete.js <galleryId>
if (require.main === module) {
  const id = Number(process.argv[2])
  if (!id) {
    console.error('Please provide a valid gallery ID.')
    process.exit(1)
  }
  deleteGalleryWithFiles(id)
    .catch(e => {
      console.error('Error deleting gallery:', e)
      process.exit(1)
    })
    .finally(() => prisma.$disconnect())
}
