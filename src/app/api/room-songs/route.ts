import { NextRequest, NextResponse } from 'next/server';
import { Song } from '@/types';
import fs from 'fs';
import path from 'path';

// Load room songs lazily (server-only, never bundled to client)
let _roomSongs: Song[] | null = null;

function getRoomSongs(): Song[] {
  if (!_roomSongs) {
    const filePath = path.join(process.cwd(), 'src', 'data', 'roomSongs.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    _roomSongs = JSON.parse(raw) as Song[];
  }
  return _roomSongs;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'find') {
    // Find a song by ID
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }
    const roomSongs = getRoomSongs();
    const song = roomSongs.find(s => s.id === id);
    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
    return NextResponse.json(song);
  }

  if (action === 'random') {
    // Get a random song by difficulty, excluding specified IDs
    const difficulty = searchParams.get('difficulty');
    const excludeParam = searchParams.get('exclude') || '';
    const excludeIds = new Set(excludeParam.split(',').filter(Boolean));

    if (!difficulty) {
      return NextResponse.json({ error: 'Missing difficulty parameter' }, { status: 400 });
    }

    const roomSongs = getRoomSongs();
    let available = roomSongs.filter(s => s.difficulty === difficulty && !excludeIds.has(s.id));
    
    if (available.length === 0) {
      // Reset exclusions if exhausted
      available = roomSongs.filter(s => s.difficulty === difficulty);
      if (available.length === 0) {
        return NextResponse.json({ error: 'No songs for this difficulty' }, { status: 404 });
      }
    }

    const song = available[Math.floor(Math.random() * available.length)];
    return NextResponse.json(song);
  }

  return NextResponse.json({ error: 'Invalid action. Use ?action=find&id=X or ?action=random&difficulty=X&exclude=id1,id2' }, { status: 400 });
}
