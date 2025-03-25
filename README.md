# Pokémon Card Collection Tracker

A web application to track your collection of illustration rare and special illustration rare Pokémon cards.

## Features

- View all illustration rare and special illustration rare Pokémon cards with images
- Filter cards by set
- Mark cards as owned with a toggle button
- Filter by ownership status (owned/not owned)
- Collection statistics showing your progress
- Data is stored in your browser's local storage

## How to Deploy

### GitHub Pages Deployment

1. **Create a GitHub account** (if you don't have one):
   - Go to https://github.com and sign up

2. **Create a new repository**:
   - Click the "+" icon in the top right and select "New repository"
   - Name it "pokemon-card-tracker"
   - Make it public
   - Initialize with a README

3. **Clone the repository** (or download files directly):
   ```bash
   git clone https://github.com/yourusername/pokemon-card-tracker.git
   cd pokemon-card-tracker
   ```

4. **Add the files to your repository**:
   - Copy all files from this package to your repository folder

5. **Commit and push the files**:
   ```bash
   git add .
   git commit -m "Add Pokemon card tracker files"
   git push origin main
   ```

6. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" > "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click Save
   - GitHub will provide you with a URL (usually https://yourusername.github.io/pokemon-card-tracker/)

## How It Works

This application fetches data directly from the Pokémon TCG API to display all illustration rare and special illustration rare cards. Your collection data (which cards you own) is stored in your browser's local storage, so it will persist between visits on the same device.

## Credits

- Card data provided by the [Pokémon TCG API](https://pokemontcg.io/)
- This application is not produced, endorsed, supported, or affiliated with Nintendo or The Pokémon Company.

## Customization

If you want to customize the application:

- `index.html` - The main HTML structure
- `styles.css` - All styling for the application
- `script.js` - The JavaScript code that powers the application

## Troubleshooting

- If cards don't load, check your internet connection
- If you encounter CORS issues, you may need to use a CORS proxy
- If you want to reset your collection data, clear your browser's local storage

## License

This project is available for personal use.
