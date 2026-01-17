# Lo-fi Music for Zone Mode

Download these CC0 (public domain) tracks from Free Music Archive and place them in this folder.

## Quick Download Links

Go to each link and click the **Download** button:

| File to save as | Download from |
|-----------------|---------------|
| `morning_coffee.mp3` | https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/morning-coffee/ |
| `calm_night.mp3` | https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/a-little-shade/ |
| `floating.mp3` | https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/foggy-headed/ |
| `vintage.mp3` | https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/vintagemp3/ |
| `clouds.mp3` | https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/clouds-6/ |
| `autumn.mp3` | https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill/autumn/ |

## Alternative: Download Entire Album

1. Go to: https://freemusicarchive.org/music/holiznacc0/lo-fi-and-chill
2. Download multiple tracks
3. Rename them to match the filenames above

## Or Use Pixabay

1. Go to https://pixabay.com/music/search/lofi/
2. Download any tracks you like
3. Rename them to match `playlist.json`
4. Update `playlist.json` if using different tracks

## License

All HoliznaCC0 tracks are **CC0 (Public Domain)** - completely free to use with no attribution required.

## Adding More Tracks

Edit `playlist.json` to add more tracks:

```json
{
  "tracks": [
    { "id": "new_track", "title": "New Track Name", "file": "/audio/lofi/new_track.mp3", "tags": ["zone"] }
  ],
  "modes": {
    "zone": ["new_track", "morning_coffee", "..."]
  }
}
```

## Modes

- `menu` - Main menu / browsing
- `casual` - Casual play
- `zone` - Zone Mode (immersive game viewing)
- `puzzle` - Puzzle solving
- `analysis` - Game analysis
