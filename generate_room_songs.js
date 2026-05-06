const fs = require('fs');

const adjectives = ["Dil", "Pyaar", "Ishq", "Mohabbat", "Dard", "Khwab", "Zindagi", "Yaad", "Safar", "Raat", "Din", "Aankh", "Saans", "Dhadkan", "Rooh", "Aasmaan", "Zameen", "Manzil", "Raasta", "Wada", "Kasam", "Dosti", "Dushman", "Aashiq", "Musafir", "Deewana", "Pagal"];
const nouns = ["Mera", "Tera", "Hamara", "Tumhara", "Apna", "Begana", "Sanam", "Mehboob", "Jaan", "Jigar", "Dilbar", "Humsafar", "Sathi", "Ajnabi", "Bahaar", "Khushi", "Gham", "Aansu", "Muskaan", "Nazar", "Pehlu", "Zulf", "Honton", "Baaton", "Yaadon", "Khayalon", "Sapnon"];
const verbs = ["Hai", "Tha", "Hoga", "Nahi", "Kyu", "Kab", "Kahan", "Kaise", "Agar", "Magar", "Lekin", "Kash", "Shayad", "Hamesha", "Kabhi", "Abhi", "Baad", "Pehle", "Sath", "Alag", "Door", "Paas", "Yahan", "Wahan"];

const songs = [];
let idCounter = 1;

for (let i = 0; i < adjectives.length; i++) {
  for (let j = 0; j < nouns.length; j++) {
    for (let k = 0; k < verbs.length; k++) {
      if (songs.length >= 10000) break;
      
      const song_name = `${adjectives[i]} ${nouns[j]} ${verbs[k]}`;
      const movie_name = `Echo Room Exclusives Vol. ${Math.ceil(idCounter / 100)}`;
      
      const english_reinterpretation = `The profound essence of ${adjectives[i].toLowerCase()} intertwined with ${nouns[j].toLowerCase()} makes my heart question ${verbs[k].toLowerCase()}. In this vast universe, our souls are forever connected through this melody.`;
      
      let difficulty = 'easy';
      if (idCounter % 3 === 0) difficulty = 'hard';
      else if (idCounter % 2 === 0) difficulty = 'medium';
      
      songs.push({
        id: `room_song_${idCounter}`,
        song_name: song_name,
        movie_name: movie_name,
        year: 2000 + (idCounter % 24),
        artist: ["Echo Ensemble"],
        original_lyric: `${adjectives[i]} ${nouns[j]} ${verbs[k]}, yeh kaisa ${adjectives[(i+1)%adjectives.length]} hai mere dil mein.`,
        original_lyric_roman: `${adjectives[i]} ${nouns[j]} ${verbs[k]}, yeh kaisa ${adjectives[(i+1)%adjectives.length]} hai mere dil mein.`,
        english_reinterpretation: english_reinterpretation,
        difficulty: difficulty,
        aliases: [song_name],
        audio_url: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/38/de/b9/38deb942-d44a-f2bb-205c-ddf05be84693/mzaf_9747647124859107103.plus.aac.p.m4a',
        lyric_start_ms: 0,
        lyric_end_ms: 25000,
        hint: `A room exclusive track`,
        for_room_only: true
      });
      idCounter++;
    }
  }
}

const content = `import { Song } from '@/types';\n\nexport const roomSongs: Song[] = ${JSON.stringify(songs, null, 2)};\n`;
fs.writeFileSync('./src/data/roomSongs.ts', content);
console.log(`Generated ${songs.length} room songs.`);
