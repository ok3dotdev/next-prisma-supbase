-- CreateTable
CREATE TABLE "_FavoriteHomes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FavoriteHomes_AB_unique" ON "_FavoriteHomes"("A", "B");

-- CreateIndex
CREATE INDEX "_FavoriteHomes_B_index" ON "_FavoriteHomes"("B");

-- AddForeignKey
ALTER TABLE "_FavoriteHomes" ADD CONSTRAINT "_FavoriteHomes_A_fkey" FOREIGN KEY ("A") REFERENCES "Home"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FavoriteHomes" ADD CONSTRAINT "_FavoriteHomes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
