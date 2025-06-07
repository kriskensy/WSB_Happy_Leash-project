## Happy Leash – Animal Adoption Panel 

A mobile app and backend for managing animal adoptions, built with **React Native** (frontend) and **.NET WebAPI** (backend). 

## Features 

- Browse adoptable dogs, cats, and other animals 
- Detailed animal profiles (photos, breed, age, health, tags) 
- Submit and review adoption requests 
- Admin panel for approving adoptions and managing animals 
- Animals with approved adoptions are automatically hidden from the adoption list 

## Requirements 

- **Backend:** .NET 6+, SQL Server 
- **Frontend:** Node.js 18+, npm/yarn, Expo CLI 

## Setup 

### Backend

cd Backend  
dotnet restore  
dotnet build  
dotnet run

### Frontend

cd Frontend  
npm install  
npx expo start

## Configuration 

- Edit `appsettings.json` for backend connection strings. 
- Update API URLs in frontend code if needed. 

## Usage 

- Use the app to browse and adopt animals. 
- Admins can approve adoptions and manage animal data. 
- Only animals without an approved adoption are visible for adoption. 