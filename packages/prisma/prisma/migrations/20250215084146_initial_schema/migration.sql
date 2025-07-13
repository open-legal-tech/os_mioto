-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('ACCESS', 'REFRESH', 'RESET_PASSWORD', 'VERIFY_EMAIL', 'UPLOAD_FILE', 'ANONYMUS_USER');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'CUSTOMER', 'ANONYMUS_USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE');

-- CreateTable
CREATE TABLE "Organization" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "slug" TEXT NOT NULL,
    "homepageUrl" TEXT,
    "analyticsKey" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "ClientPortal" (
    "organizationUuid" UUID NOT NULL,
    "logoUuid" UUID,
    "logoUrl" TEXT,
    "backgroundUuid" UUID,
    "backgroundUrl" TEXT,
    "privacyUuid" UUID,
    "privacyUrl" TEXT,
    "termsUuid" UUID,
    "termsUrl" TEXT,

    CONSTRAINT "ClientPortal_pkey" PRIMARY KEY ("organizationUuid")
);

-- CreateTable
CREATE TABLE "Theme" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "customCss" TEXT,
    "organizationUuid" UUID NOT NULL,
    "orgThemeUuid" UUID,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Session" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "userLabel" TEXT,
    "state" JSONB NOT NULL,
    "status" "SessionStatus" NOT NULL,
    "ownerUuid" UUID NOT NULL,
    "treeUuid" UUID NOT NULL,
    "treeSnapshotUuid" UUID,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "ownerUuid" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "blacklisted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationUuid" UUID NOT NULL,
    "role" "Roles" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'INVITED',
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Account" (
    "termsVersion" INTEGER NOT NULL DEFAULT 0,
    "privacyVersion" INTEGER NOT NULL DEFAULT 0,
    "email" TEXT NOT NULL,
    "emailIsVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT,
    "userUuid" UUID NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("userUuid")
);

-- CreateTable
CREATE TABLE "Employee" (
    "userUuid" UUID NOT NULL,
    "accessCode" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("userUuid")
);

-- CreateTable
CREATE TABLE "Customer" (
    "userUuid" UUID NOT NULL,
    "referenceNumber" TEXT,
    "firstname" TEXT,
    "lastname" TEXT,
    "company" TEXT,
    "hasPortalAccess" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("userUuid")
);

-- CreateTable
CREATE TABLE "File" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayName" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Asset" (
    "organizationUuid" UUID NOT NULL,
    "fileUuid" UUID NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("fileUuid")
);

-- CreateTable
CREATE TABLE "Template" (
    "organizationUuid" UUID NOT NULL,
    "fileUuid" UUID NOT NULL,
    "treeInternalUuid" UUID NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("fileUuid")
);

-- CreateTable
CREATE TABLE "GeneratedFile" (
    "sessionUuid" UUID NOT NULL,
    "fileUuid" UUID NOT NULL,

    CONSTRAINT "GeneratedFile_pkey" PRIMARY KEY ("fileUuid")
);

-- CreateTable
CREATE TABLE "UserUpload" (
    "sessionUuid" UUID NOT NULL,
    "fileUuid" UUID NOT NULL,
    "userUuid" UUID NOT NULL,

    CONSTRAINT "UserUpload_pkey" PRIMARY KEY ("fileUuid")
);

-- CreateTable
CREATE TABLE "Tree" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "document" BYTEA,
    "organizationUuid" UUID NOT NULL,
    "themeUuid" UUID,
    "isPublic" BOOLEAN,

    CONSTRAINT "Tree_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "TreeSnapshot" (
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "document" BYTEA,
    "originTreeUuid" UUID NOT NULL,

    CONSTRAINT "TreeSnapshot_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "SoldTree" (
    "treeUuid" UUID NOT NULL,
    "credits" INTEGER,
    "customerUserUuid" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_EmployeeToTree" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_EmployeeToTree_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TemplateToTree" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_TemplateToTree_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TemplateToTreeSnapshot" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_TemplateToTreeSnapshot_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_uuid_key" ON "Organization"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortal_organizationUuid_key" ON "ClientPortal"("organizationUuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortal_logoUuid_key" ON "ClientPortal"("logoUuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortal_backgroundUuid_key" ON "ClientPortal"("backgroundUuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortal_privacyUuid_key" ON "ClientPortal"("privacyUuid");

-- CreateIndex
CREATE UNIQUE INDEX "ClientPortal_termsUuid_key" ON "ClientPortal"("termsUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_orgThemeUuid_key" ON "Theme"("orgThemeUuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userUuid_key" ON "Account"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_userUuid_key" ON "Employee"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userUuid_key" ON "Customer"("userUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Tree_uuid_key" ON "Tree"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SoldTree_treeUuid_customerUserUuid_key" ON "SoldTree"("treeUuid", "customerUserUuid");

-- CreateIndex
CREATE INDEX "_EmployeeToTree_B_index" ON "_EmployeeToTree"("B");

-- CreateIndex
CREATE INDEX "_TemplateToTree_B_index" ON "_TemplateToTree"("B");

-- CreateIndex
CREATE INDEX "_TemplateToTreeSnapshot_B_index" ON "_TemplateToTreeSnapshot"("B");

-- AddForeignKey
ALTER TABLE "ClientPortal" ADD CONSTRAINT "ClientPortal_organizationUuid_fkey" FOREIGN KEY ("organizationUuid") REFERENCES "Organization"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortal" ADD CONSTRAINT "ClientPortal_logoUuid_fkey" FOREIGN KEY ("logoUuid") REFERENCES "Asset"("fileUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortal" ADD CONSTRAINT "ClientPortal_backgroundUuid_fkey" FOREIGN KEY ("backgroundUuid") REFERENCES "Asset"("fileUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortal" ADD CONSTRAINT "ClientPortal_privacyUuid_fkey" FOREIGN KEY ("privacyUuid") REFERENCES "Asset"("fileUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientPortal" ADD CONSTRAINT "ClientPortal_termsUuid_fkey" FOREIGN KEY ("termsUuid") REFERENCES "Asset"("fileUuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_organizationUuid_fkey" FOREIGN KEY ("organizationUuid") REFERENCES "Organization"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_orgThemeUuid_fkey" FOREIGN KEY ("orgThemeUuid") REFERENCES "Organization"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_treeUuid_fkey" FOREIGN KEY ("treeUuid") REFERENCES "Tree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_treeSnapshotUuid_fkey" FOREIGN KEY ("treeSnapshotUuid") REFERENCES "TreeSnapshot"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_ownerUuid_fkey" FOREIGN KEY ("ownerUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationUuid_fkey" FOREIGN KEY ("organizationUuid") REFERENCES "Organization"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_organizationUuid_fkey" FOREIGN KEY ("organizationUuid") REFERENCES "Organization"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_fileUuid_fkey" FOREIGN KEY ("fileUuid") REFERENCES "File"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_organizationUuid_fkey" FOREIGN KEY ("organizationUuid") REFERENCES "Organization"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_fileUuid_fkey" FOREIGN KEY ("fileUuid") REFERENCES "File"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedFile" ADD CONSTRAINT "GeneratedFile_sessionUuid_fkey" FOREIGN KEY ("sessionUuid") REFERENCES "Session"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedFile" ADD CONSTRAINT "GeneratedFile_fileUuid_fkey" FOREIGN KEY ("fileUuid") REFERENCES "File"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpload" ADD CONSTRAINT "UserUpload_sessionUuid_fkey" FOREIGN KEY ("sessionUuid") REFERENCES "Session"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpload" ADD CONSTRAINT "UserUpload_fileUuid_fkey" FOREIGN KEY ("fileUuid") REFERENCES "File"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpload" ADD CONSTRAINT "UserUpload_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_organizationUuid_fkey" FOREIGN KEY ("organizationUuid") REFERENCES "Organization"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tree" ADD CONSTRAINT "Tree_themeUuid_fkey" FOREIGN KEY ("themeUuid") REFERENCES "Theme"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TreeSnapshot" ADD CONSTRAINT "TreeSnapshot_originTreeUuid_fkey" FOREIGN KEY ("originTreeUuid") REFERENCES "Tree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldTree" ADD CONSTRAINT "SoldTree_treeUuid_fkey" FOREIGN KEY ("treeUuid") REFERENCES "Tree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoldTree" ADD CONSTRAINT "SoldTree_customerUserUuid_fkey" FOREIGN KEY ("customerUserUuid") REFERENCES "Customer"("userUuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToTree" ADD CONSTRAINT "_EmployeeToTree_A_fkey" FOREIGN KEY ("A") REFERENCES "Employee"("userUuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmployeeToTree" ADD CONSTRAINT "_EmployeeToTree_B_fkey" FOREIGN KEY ("B") REFERENCES "Tree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TemplateToTree" ADD CONSTRAINT "_TemplateToTree_A_fkey" FOREIGN KEY ("A") REFERENCES "Template"("fileUuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TemplateToTree" ADD CONSTRAINT "_TemplateToTree_B_fkey" FOREIGN KEY ("B") REFERENCES "Tree"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TemplateToTreeSnapshot" ADD CONSTRAINT "_TemplateToTreeSnapshot_A_fkey" FOREIGN KEY ("A") REFERENCES "Template"("fileUuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TemplateToTreeSnapshot" ADD CONSTRAINT "_TemplateToTreeSnapshot_B_fkey" FOREIGN KEY ("B") REFERENCES "TreeSnapshot"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
