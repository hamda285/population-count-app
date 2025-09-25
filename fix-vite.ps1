Write-Host "Deleting .vite cache..."
Remove-Item -Recurse -Force .\node_modules\.vite -ErrorAction SilentlyContinue

Write-Host "Deleting node_modules..."
Remove-Item -Recurse -Force .\node_modules -ErrorAction SilentlyContinue

Write-Host "Deleting package-lock.json..."
Remove-Item -Force .\package-lock.json -ErrorAction SilentlyContinue

Write-Host "Installing dependencies..."
npm install

Write-Host "Starting development server..."
npm run dev
