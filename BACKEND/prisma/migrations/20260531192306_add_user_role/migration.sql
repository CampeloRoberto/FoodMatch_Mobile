-- AlterTable
ALTER TABLE `user` ADD COLUMN `restaurantId` INTEGER NULL,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'CUSTOMER';

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_restaurantId_fkey` FOREIGN KEY (`restaurantId`) REFERENCES `Restaurant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
